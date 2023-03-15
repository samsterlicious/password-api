import {
  AuthorizationType,
  LambdaIntegration,
  RequestAuthorizer,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { PasswordLambdas } from "../../lambdas/password";

export function createPasswordRoutes(
  api: RestApi,
  authorizerLambda: RequestAuthorizer,
  lambdas: PasswordLambdas
): void {
  const passwordResource = api.root.addResource("password");

  passwordResource.addMethod("POST", new LambdaIntegration(lambdas.create), {
    authorizationType: AuthorizationType.CUSTOM,
    authorizer: authorizerLambda,
  });

  passwordResource.addMethod("GET", new LambdaIntegration(lambdas.get), {
    authorizationType: AuthorizationType.CUSTOM,
    authorizer: authorizerLambda,
  });
}
