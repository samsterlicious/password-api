#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { PasswordApiStack } from "../lib/password-api-stack";

const app = new cdk.App();
new PasswordApiStack(app, "PasswordApiStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
