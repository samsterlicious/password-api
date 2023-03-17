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

  const loginLambda = new lambdaNodejs.NodejsFunction(scope, "loginLambda", {
    entry: "src/handlers/user/login.ts",
    handler: "main",
    environment: {
      TABLE_NAME: table.tableName,
    },
  });

  table.grantReadWriteData(createUserLambda);
  table.grantReadData(loginLambda);

  return {
    create: createUserLambda,
    login: loginLambda,
  };
}

export type UserLambdas = {
  create: lambdaNodejs.NodejsFunction;
  login: lambdaNodejs.NodejsFunction;
};
