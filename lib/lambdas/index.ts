import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { createAuthorizer } from "./authorizer";
import { createPasswordLambdas, PasswordLambdas } from "./password";
import { createUserLambdas, UserLambdas } from "./user";

export function createLambdas(
  scope: Construct,
  table: dynamodb.Table
): Lambdas {
  return {
    authorizer: createAuthorizer(scope, table),
    password: createPasswordLambdas(scope, table),
    user: createUserLambdas(scope, table),
  };
}

export type Lambdas = {
  authorizer: NodejsFunction;
  password: PasswordLambdas;
  user: UserLambdas;
};
