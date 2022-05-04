const headers = require('../conf/headers');

function errorHandler(res, statusCode, msgCode) {
  const errorsMsg = {
    400: {
      4001: 'Bad Request Error - format error',
      4002: 'Bad Request Error - syntax error',
      4003: 'Bad Request Error - ID not found',
    },
    404: 'Not Found',
    405: 'Method Not Allowed',
  };
  let msg = '';
  if(msgCode) {
    msg = errorsMsg[statusCode][msgCode];
  } else {
    msg = errorsMsg[statusCode];
  }
  res.writeHead(statusCode, headers);
  res.write(JSON.stringify({
    "status": "false",
    "message": msg,
  }));
  res.end();
}

module.exports = errorHandler;
