import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserLambdas } from "../../lambdas/user";

export function createUserRoutes(api: RestApi, lambdas: UserLambdas): void {
  const userResource = api.root.addResource("user");
  const loginResource = userResource.addResource("login");

  userResource.addMethod("POST", new LambdaIntegration(lambdas.create), {
    apiKeyRequired: true,
  });

  loginResource.addMethod("POST", new LambdaIntegration(lambdas.login), {
    apiKeyRequired: true,
  });
}
