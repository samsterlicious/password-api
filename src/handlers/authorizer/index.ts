import {
  APIGatewayAuthorizerResult,
  APIGatewayAuthorizerResultContext,
  APIGatewayRequestAuthorizerEvent,
  PolicyDocument,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export async function main(
  event: APIGatewayRequestAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> {
  const { TABLE_NAME } = process.env;

  const key =
    event.headers?.Authorization ?? event.headers?.authorization ?? "";

  const documentClient = new DocumentClient();

  const response = await documentClient
    .query({
      TableName: TABLE_NAME ?? "",
      IndexName: "gsi1",
      KeyConditionExpression: "g1_id = :id and g1_sk = :sk",
      ExpressionAttributeValues: {
        ":id": `key`,
        ":sk": key,
      },
    })
    .promise();

  const items = response.Items;
  if (items && items.length > 0) {
    return generatePolicy("Allow", {
      email: key.replace(/#.+$/, ""),
      iv: key.replace(/^.+#/, ""),
      secretPassword: key.replace(/^.+#([^#]+)#.+$/, "$1"),
    });
  } else {
    return generatePolicy("Deny");
  }
}

const generatePolicy = (
  effect: string,
  context?: APIGatewayAuthorizerResultContext
): APIGatewayAuthorizerResult => {
  const policyDocument: PolicyDocument = {
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: "*",
      },
    ],
    Version: "2012-10-17",
  };
  return {
    context,
    principalId: "user",
    policyDocument,
  };
};
