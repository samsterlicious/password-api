import { aws_route53_targets, Duration } from "aws-cdk-lib";
import {
  ApiKeySourceType,
  Cors,
  IdentitySource,
  RequestAuthorizer,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { Lambdas } from "../lambdas";
import { createPasswordRoutes } from "./routes/password";
import { createUserRoutes } from "./routes/user";

const rootDomain = "sammy.link";

export default function createApi(scope: Construct, lambdas: Lambdas): RestApi {
  const zone = HostedZone.fromLookup(scope, "baseZone", {
    domainName: rootDomain,
  });

  const certificate = new Certificate(scope, "Certificate", {
    domainName: `password.${rootDomain}`,
    validation: CertificateValidation.fromDns(zone),
  });

  const api = new RestApi(scope, "api", {
    restApiName: "password-api",
    apiKeySourceType: ApiKeySourceType.HEADER,

    defaultCorsPreflightOptions: {
      allowHeaders: ["Authorization", "Content-Type", ...Cors.DEFAULT_HEADERS],
      allowMethods: Cors.ALL_METHODS,
      allowOrigins: ["*"],
      allowCredentials: true,
      statusCode: 200,
    },
    domainName: {
      basePath: "api",
      certificate,
      domainName: `password.${rootDomain}`,
    },
  });

  const requestAuthorizer = new RequestAuthorizer(
    scope,
    "AuthorizationHeaderAuthorizer",
    {
      handler: lambdas.authorizer,
      identitySources: [IdentitySource.header("Authorization")],
      resultsCacheTtl: Duration.minutes(5),
    }
  );

  createApiKey(scope, api);

  createPasswordRoutes(api, requestAuthorizer, lambdas.password);
  createUserRoutes(api, lambdas.user);

  new ARecord(scope, "apiDNS", {
    zone,
    recordName: "password",
    target: RecordTarget.fromAlias(new aws_route53_targets.ApiGateway(api)),
  });

  return api;
}

function createApiKey(scope: Construct, api: RestApi): void {
  const apiKey = StringParameter.valueFromLookup(scope, "passwordApiKey");

  const key = api.addApiKey("apiKey", {
    value: apiKey,
  });

  const plan = api.addUsagePlan("UsagePlan", {
    name: "UsagePlan",
    throttle: {
      rateLimit: 100,
      burstLimit: 100,
    },

    apiStages: [{ api, stage: api.deploymentStage }],
  });

  plan.addApiKey(key);
}
