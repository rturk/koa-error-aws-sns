/**
 * Middleware that log Koa errors to AWS SNS topic.
 */

import humanize from 'humanize-number';

/**
 * Log error to AWS SNS Middleware.
 */
export default function koaErrorLogToSNS({sns, TargetArn}) {
  return async (ctx, next) => {
    // Time the request date
    const start = new Date;

    if(sns && TargetArn) {
      try {
        await next();
      } catch (err) {
        await log(sns, TargetArn, ctx, start, null, err); // Log Uncaught Downstream errors
        throw err;
      }
    } else {
      throw "Koa Error AWS SNS needs a SNS object and a Target Arn"
    }
  }
}

/**
 * Log Koa errors to AWS SNS helper.
 */

async function log(sns, TargetArn, ctx, start, length, err, event) {

  //Only log >= 400
  if(err.status >= 400) {
    const end = new Date;

    const Message = {
        event,
        method: ctx.method,
        originalUrl: ctx.originalUrl,
        status,
        start,
        end,
        delta: time(start),
        length,
    };
    console.log('mid error message: ', message);

    data = await sns.publish({
      TargetArn,
      Message,
      MessageStructure: 'json',
    });

    console.log('push sent: ', data);
  }
}

/**
 * Helper funtion
 * Calculates the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */

function time(start,end) {
  let delta = end - start;
  delta = delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's';
  return humanize(delta);
}
