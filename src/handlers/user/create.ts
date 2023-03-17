import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { getHash } from "../../util/encrypt";
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
  const hashPassword = getHash(body.password);
  const key = `${body.email}#${hashPassword}`;
  try {
    await documentClient
      .put({
        TableName: TABLE_NAME!,
        Item: {
          id: "USER",
          sort_key: body.email,
          g1_id: "key",
          g1_sk: key,
        },
        ConditionExpression: "attribute_not_exists(sort_key)",
      })
      .promise();

    return formatApiResponse({ key });
  } catch (e) {
    return formatApiResponse({ message: "user already exists" }, 500);
  }
}

type Body = {
  email?: string;
  password?: string;
};
