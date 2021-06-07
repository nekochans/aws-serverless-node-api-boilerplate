import type { AWS } from '@serverless/typescript';
import { hello, helloWithPath, addressSearch, createUser } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'serverless-node-api',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: process.env.DEPLOY_STAGE,
    region: 'ap-northeast-1',
    profile: process.env.AWS_PROFILE,
    logRetentionInDays: 7,
    httpApi: {
      cors: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_WRITER_HOSTNAME: process.env.DB_WRITER_HOSTNAME,
      DB_READER_HOSTNAME: process.env.DB_READER_HOSTNAME,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
      DATABASE_URL: process.env.DATABASE_URL,
    },
    lambdaHashingVersion: '20201221',
    vpc: {
      securityGroupIds: [process.env.SECURITY_GROUP_ID],
      subnetIds: [
        process.env.SUBNET_ID_1,
        process.env.SUBNET_ID_2,
        process.env.SUBNET_ID_3,
      ],
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'ec2:CreateNetworkInterface',
              'ec2:DescribeNetworkInterfaces',
              'ec2:DetachNetworkInterface',
              'ec2:DeleteNetworkInterface',
            ],
            Resource: '*'
          },
        ],
      }
    }
  },
  // import the function via paths
  functions: { hello, helloWithPath, addressSearch, createUser },
};

module.exports = serverlessConfiguration;
