/**
 * Middleware that log Koa errors to AWS SNS topic.
 */

var AWS = require('aws-sdk');

  const message = {
    test: "Test Message",
    error: "Error test",
    default: "ERROR on server, check JSON payload",
  };

  var sns = new AWS.SNS({ params: { TopicArn: 'arn:aws:sns:us-east-1:096957576271:brandlovers-server-error' },
                          region: 'us-east-1',
            });


  console.log('sending log message to SNS');

  // sns.publish({
  //       // Message: JSON.stringify(message),
  //       // MessageStructure: 'json',
  //       Message: "Teste!!",
  //       Subject: "Brand Lovers ERROR",
  //     }, function(err, data) {
  //         if(err) {
  //           console.log(err.stack);
  //         } else {
  //           console.log(data);
  //         }
  //     });

      sns.publish({
            Subject: "Brand Lovers ERROR",
            Message: JSON.stringify(message),
          }, function(err, data) {
              if(err) {
                console.log(err.stack);
              } else {
                console.log(data);
              }
          });
