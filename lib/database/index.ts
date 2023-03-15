import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export default function getDynamoTable(scope: Construct): dynamodb.Table {
  const table = new dynamodb.Table(scope, "DynamoDbTable", {
    tableName: "passwordz",
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "sort_key", type: dynamodb.AttributeType.STRING },
    writeCapacity: 1,
    readCapacity: 1,
    billingMode: dynamodb.BillingMode.PROVISIONED,
  });

  table.addGlobalSecondaryIndex({
    indexName: "gsi1",
    partitionKey: { name: "g1_id", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "g1_sk", type: dynamodb.AttributeType.STRING },
    readCapacity: 1,
    writeCapacity: 1,
  });

  table.addGlobalSecondaryIndex({
    indexName: "gsi2",
    partitionKey: { name: "g2_id", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "g2_sk", type: dynamodb.AttributeType.STRING },
    readCapacity: 1,
    writeCapacity: 1,
  });

  return table;
}
