import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export function createAuthorizer(
  scope: Construct,
  table: Table
): NodejsFunction {
  const authorizerLambda = new NodejsFunction(scope, "authorizerLambda", {
    entry: "src/handlers/authorizer/index.ts",
    handler: "main",
    environment: {
      TABLE_NAME: table.tableName,
    },
    timeout: Duration.seconds(30),
  });

  table.grantReadData(authorizerLambda);

  return authorizerLambda;
}
