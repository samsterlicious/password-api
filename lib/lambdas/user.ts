import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export function createUserLambdas(
  scope: Construct,
  table: dynamodb.Table
): UserLambdas {
  const createUserLambda = new lambdaNodejs.NodejsFunction(
    scope,
    "createUserLambda",
    {
      entry: "src/handlers/user/create.ts",
      handler: "main",
      environment: {
        TABLE_NAME: table.tableName,
      },
    }
  );

  table.grantReadWriteData(createUserLambda);

  return {
    create: createUserLambda,
  };
}

export type UserLambdas = {
  create: lambdaNodejs.NodejsFunction;
};
