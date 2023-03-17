import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { getHash } from "../../util/encrypt";
import { getPassword } from "../../util/password";
import { formatApiResponse } from "../../util/response";

export async function main(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { TABLE_NAME } = process.env;

  const body: Body = JSON.parse(event.body ?? "{}");

  if (!body.email || !body.password) {
    return formatApiResponse({ message: "Missing email or password" }, 400);
  }

  const documentClient = new DocumentClient();

  const response = await documentClient
    .get({
      TableName: TABLE_NAME!,
      Key: {
        id: "USER",
        sort_key: body.email,
      },
    })
    .promise();

  const item = response.Item;

  if (item && getHash(body.password) === getPassword(item.g1_sk)) {
    return formatApiResponse({ key: response.Item!.g1_sk });
  } else {
    return formatApiResponse({ message: "No user" }, 404);
  }
}

type Body = {
  email?: string;
  password?: string;
};
