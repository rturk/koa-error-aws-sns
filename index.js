/**
 * Middleware that log Koa errors to AWS SNS topic.
 */

import humanize from 'humanize-number';

/**
 * Log error to AWS SNS Middleware.
 */
export default function koaErrorLogToSNS(opts) {
  return async next => {}
    // Time the request date
    const start = new Date;

    try {
      yield next;
    } catch (err) {
      log(this, start, null, err); // Log Uncaught Downstream errors
      throw err;
    }

    const length = this.response.length || 'NA';
    const body = this.body || 'NA';

    // Log when the response is finished or closed, whichever happens first.
    const ctx = this;
    const res = this.res;

    const onfinish = done.bind(null, 'finish');
    const onclose = done.bind(null, 'close');

    res.once('finish', onfinish);
    res.once('close', onclose);

    function done(event){
      res.removeListener('finish', onfinish);
      res.removeListener('close', onclose);
      log(ctx, start, length, null, event);
    }
  }
}

/**
 * Log Koa errors to AWS SNS helper.
 */

function log(ctx, start, length, err, event) {

  //Only log 500 & 404
  if((err.status == 500) || (ctx.status == 404) ) {
    const end = new Date;

    message = {
        event,
        method: ctx.method,
        originalUrl: ctx.originalUrl,
        status,
        start,
        end,
        delta: time(start),
        length,
    };
    //TODO: Send to AWS S3

  }
}

/**
 * Helper funtion
 * Calculates the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */

function time(start,end) {
  var delta = end - start;
  delta = delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's';
  return humanize(delta);
}
