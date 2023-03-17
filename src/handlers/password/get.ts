import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { decryptText } from "../../util/encrypt";

export async function main(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { TABLE_NAME } = process.env;

  const { email, iv, secretPassword } = event.requestContext.authorizer!;

  const { hostname } = event.queryStringParameters!;

  const documentClient = new DocumentClient();

  const resp = await documentClient
    .query({
      TableName: TABLE_NAME!,
      KeyConditionExpression: "id = :id and begins_with(sort_key, :sk)",
      ExpressionAttributeValues: {
        ":id": email,
        ":sk": hostname,
      },
    })
    .promise();

  return {
    body: JSON.stringify(
      (resp.Items ?? []).map((item) => ({
        password: decryptText(item.password, secretPassword, iv),
        username: decryptText(
          item.sort_key.replace(/^.+#/, ""),
          secretPassword,
          iv
        ),
      }))
    ),
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "content-type": "text/html",
    },
  };
}
