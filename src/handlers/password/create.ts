import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { encryptText } from "../../util/encrypt";

export async function main(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { PASSWORD_IV, TABLE_NAME } = process.env;

  const body: Body = JSON.parse(event.body!);

  const { email, secretPassword } = event.requestContext.authorizer!;

  const documentClient = new DocumentClient();

  await documentClient
    .put({
      TableName: TABLE_NAME!,
      Item: {
        id: email,
        sort_key: `${body.hostname}#${encryptText(
          body.username,
          secretPassword,
          PASSWORD_IV!
        )}`,
        g1_id: "Password",
        g1_sk: `${body.hostname}#${encryptText(
          body.username,
          secretPassword,
          PASSWORD_IV!
        )}`,
        password: encryptText(body.password, secretPassword, PASSWORD_IV!),
      },
    })
    .promise();

  return {
    body: JSON.stringify({}),
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "content-type": "text/html",
    },
  };
}

type Body = {
  password: string;
  hostname: string;
  username: string;
};
