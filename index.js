/**
 * Koa log errors to AWS SNS topic.
 */

var humanize = require('humanize-number');

//Expose the error logger.
module.exports = koaErrorLogToSNS;

/**
 * Log error to AWS SNS Middleware.
 */
function koaErrorLogToSNS(opts) {
  return function *logger(next) {
    // Time the request date
    const start = new Date;

    try {
      yield next;
    } catch (err) {
      // log uncaught downstream errors
      log(this, start, null, err);
      throw err;
    }

    var length = this.response.length || 'NA';
    var body = this.body || 'NA';

    // Log when the response is finished or closed, whichever happens first.
    var ctx = this;
    var res = this.res;

    var onfinish = done.bind(null, 'finish');
    var onclose = done.bind(null, 'close');

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
 * Log helper.
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

  }
}

/**
 * Calculate the response time in a human readable format.
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
