import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function main(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { TABLE_NAME } = process.env;
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
