# koa-error-sns
This Middleware detects errors in Koa Servers and sends messages to an AWS SNS topic. From SNS you can set up different subscribers; such as email subscribers address, SQS queues or Lambda function. Simple use case is subscribe an email address to the SNS topic that will receive all error messages.

## How it works
The Middleware listens to errors thrown from downstream components using try & catch. Once an error is detected a message with error detail as well other relevant information (context, request and whenever possible response information) is published to your SNS endpoint.
The Middleware code is extremely lightweight and is intended to be used in production environments. 

Please note that this middleware will solely catch errors from downstream components, so in order to catch relevant errors it must be one of the first middleware installed the Koa initialization stack.

## Usage
```js
import errorToSNS from 'koa-error-aws-sns';
import AWS from 'aws-sdk';

AWS.config.loadFromPath('./config.json');

const sns = new AWS.SNS();
const TargetArn = 'arn:aws:sns:us-west-1:302467918846:endpoint';

const app = new Koa();
app.use(errorToSNS({sns, TargetArn});
```
