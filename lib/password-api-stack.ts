import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import createApi from "./apiGateway";
import getDynamoTable from "./database";
import { createLambdas } from "./lambdas";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PasswordApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = getDynamoTable(this);

    const lambdas = createLambdas(this, table);

    createApi(this, lambdas);
  }
}
