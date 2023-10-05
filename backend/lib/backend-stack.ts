import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export class BackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Create the AppSync API
		const api = new appsync.GraphqlApi(this, "Api", {
			name: "reservations_api",
			definition: appsync.Definition.fromFile(path.join(__dirname, "schema.graphql")),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: appsync.AuthorizationType.IAM,
				},
			},
			xrayEnabled: true,
		});

		// Create DynamoDB table & table connection
		const dynamodbTable = new ddb.Table(this, "DynamoDBTable", {
			partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
			sortKey: { name: "SK", type: ddb.AttributeType.STRING },
		});

		const tableDatasource = api.addDynamoDbDataSource("DynamoDBTable", dynamodbTable);

		// Create GraphQL resolvers for DynamoDB queries, mutations, etc.
	}
}
