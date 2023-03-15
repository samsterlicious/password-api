import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserLambdas } from "../../lambdas/user";

export function createUserRoutes(api: RestApi, lambdas: UserLambdas): void {
  const userResource = api.root.addResource("user");

  userResource.addMethod("POST", new LambdaIntegration(lambdas.create), {
    apiKeyRequired: true,
  });
}
