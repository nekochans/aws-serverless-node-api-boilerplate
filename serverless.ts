import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import helloWithPath from '@functions/helloWithPath';

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
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello, helloWithPath },
};

module.exports = serverlessConfiguration;
