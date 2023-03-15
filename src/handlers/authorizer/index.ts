import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  PolicyDocument,
} from "aws-lambda";

export async function main(
  event: APIGatewayRequestAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> {
  //   const token =
  //     event.headers?.Authorization ?? event.headers?.authorization ?? "";
  try {
    return generatePolicy("user", "Allow");
  } catch (exc) {
    return generatePolicy("user", "Deny");
  }
}

const generatePolicy = (
  principalId: string,
  effect: string
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
    principalId,
    policyDocument,
  };
};
