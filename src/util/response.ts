export function formatApiResponse(body: any, statusCode?: number) {
  return {
    body: JSON.stringify(body),
    statusCode: statusCode ?? 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "content-type": "text/html",
    },
  };
}
