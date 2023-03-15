import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export function createPasswordLambdas(
  scope: Construct,
  table: dynamodb.Table
): PasswordLambdas {
  const createPasswordLambda = new lambdaNodejs.NodejsFunction(
    scope,
    "createPasswordLambda",
    {
      entry: "src/handlers/password/create.ts",
      handler: "main",
      environment: {
        TABLE_NAME: table.tableName,
      },
    }
  );

  const getPasswordsLambda = new lambdaNodejs.NodejsFunction(
    scope,
    "getPasswordsLambda",
    {
      entry: "src/handlers/password/get.ts",
      handler: "main",
      environment: {
        TABLE_NAME: table.tableName,
      },
    }
  );

  table.grantReadWriteData(createPasswordLambda);
  table.grantReadData(getPasswordsLambda);

  return {
    create: createPasswordLambda,
    get: getPasswordsLambda,
  };
}

export type PasswordLambdas = {
  create: lambdaNodejs.NodejsFunction;
  get: lambdaNodejs.NodejsFunction;
};
