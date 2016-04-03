# koa-error-sns
Koa - Send server errors 500's or 400's to an AWS SNS topic - ie notifyMe

## Usage
```js
import errorToSNS from 'koa-error-aws-sns';
import AWS from 'aws-sdk';

AWS.config.loadFromPath('./config.json');

const sns = new AWS.SNS();
const TargetArn = 'arn:aws:sns:us-west-2:302467918846:endpoint/APNS_SANDBOX/<APP_NAME>/<USER_TOKEN>';

const app = new Koa();
app.use(errorToSNS({sns, TargetArn});
```