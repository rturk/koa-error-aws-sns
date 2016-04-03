/**
 * Middleware that log Koa errors to AWS SNS topic.
 */

import humanize from 'humanize-number';

/**
 * Log error to AWS SNS Middleware.
 */
export default function koaErrorLogToSNS({sns, TargetArn}) {
  console.log("koaErrorLogToSNS: setup...");
  return async (ctx, next) => {
    // Time the request start
    const start = new Date;

    // if(sns && TargetArn) {
    if(sns) {
      try {
        await next();
      } catch (err) {
        console.log("koaErrorLogToSNS: Error detected");
        log(sns, ctx, start, err); // Log Uncaught Downstream errors
        throw err;
      }
    } else {
      throw "Koa Error AWS SNS needs a SNS object"
    }
  }
}

/**
 * Log Koa errors to AWS SNS helper.
 */

function log(sns, ctx, start, error) {

  console.log("koaErrorLogToSNS: Log..!");
    const end = new Date;

    const request = {
      headers: ctx.headers || 'NA',
      method: ctx.method || 'NA',
      url: ctx.url || 'NA',
      originalUrl: ctx.originalUrl || 'NA',
      origin: ctx.origin || 'NA',
      href: ctx.href || 'NA',
      path: ctx.path || 'NA',
      query: ctx.query || 'NA',
      querystring: ctx.querystring || 'NA',
      host: ctx.host || 'NA',
      hostname: ctx.hostname || 'NA',
      protocol: ctx.protocol || 'NA',
      ip: ctx.ip || 'NA',
      ips: ctx.ips || 'NA',
      subdomains: ctx.subdomains || 'NA',
      secure: ctx.secure || 'NA',
    };
    const response = {
      // body: ctx.body || 'NA',
      status: ctx.status || 'NA',
      message: ctx.message || 'NA',
      length: ctx.length || 'NA',
      type: ctx.type || 'NA',
    };

    const message = {
      request,
      response,
      error: {  error: error || 'NA',
                stack: JSON.stringify(error.stack) || 'NA',
      },
      date: { start,
              end,
              delta: time(start,end),
      },
    };

    sns.publish({
      Subject: "KOA Server Error",
      Message : JSON.stringify(message),
    },
    function(err, data) {
        if(!err) {
          console.log("Server error sent to AWS SNS", data);
        }
    });

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
