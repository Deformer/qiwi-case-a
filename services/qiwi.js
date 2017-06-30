const request = require('request');

module.exports = {
  sendSms : (phoneNumber, cb) => {
    request({
      method: 'POST',
      url: 'https://w.qiwi.com/oauth/authorize',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, compress',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'HTTPie/0.3.0'
      },
      form: {
        client_id: 'qw-fintech',
        client_secret: 'Xghj!bkjv64',
        'client-software': 'qw-fintech-0.0.1',
        response_type: 'code',
        username: phoneNumber.toString()
      }
    }, cb)
  },
  confirmSms: (authCode ,smsCode,cb) => {
    request({
      method: 'POST',
      url: 'https://w.qiwi.com/oauth/access_token',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, compress',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'HTTPie/0.3.0'
      },
      form: {
        client_id: 'qw-fintech',
        client_secret: 'Xghj!bkjv64',
        'client-software': 'qw-fintech-0.0.1',
        grant_type: 'urn:qiwi:oauth:grant-type:vcode',
        code: authCode,
        vcode: smsCode.toString()
      }
    },cb)
  },
  doTransaction: (senderNumber ,recipientNumber, accessToken, uid, amountOfTransaction, cb) => {
    const AuthorizationToken = new Buffer(`${senderNumber}:${accessToken}`).toString('base64');
    request({
      method: 'POST',
      url: 'https://sinap.qiwi.com/api/terms/99/payments',
      headers: {
        'Accept': 'application/vnd.qiwi.v2+json',
        'Accept-Encoding': 'gzip, deflate, compress',
        'Content-Type': 'application/json',
        'Authorization': `Token ${AuthorizationToken}`,
        'User-Agent': 'HTTPie/0.3.0'
      },
      json: JSON.stringify({
        fields : {
          account : recipientNumber.toString(),
          prvId : "99"
        },
        id: uid,
        paymentMethod : {
          type:"Account",
          accountId:"643"
        },
        sum : {
          amount : amountOfTransaction.toString(),
          currency : "643"
        }
      })
    },cb);
  }
};

// module.exports.sendSms(79218678737, (err, resp, body) => {
//   if(err)
//     return console.log(err);
//   console.log(body);
// });

// module.exports.confirmSms("da223dd2cdecf7cb015395fd356843c0", 929838,(err, resp, body) => {
//   if(err)
//     return console.log(err);
//   console.log(body);
// });
// slava {"access_token":"6020b2ade135ec9fc4148de3ea9df132","token_type":"Bearer","expires_in":"2592000","refresh_token":"cadf8b635d9265030a44fd91d60bd83f","phone":"9218678737"}
//{"access_token":"1e1bc0d3363197e17425e3f1e481ae49","token_type":"Bearer","expires_in":"2592000","refresh_token":"1ba8e98b473484f37c314e75a0db1b89","phone":"9117439554"}

module.exports.doTransaction("79117439554", "79218678737", "1e1bc0d3363197e17425e3f1e481ae49", new Date().getTime().toString(), "10.5",(err, resp, body) => {
  if(err) {
    console.log('err', err);
  }
  console.log(resp.toJSON())
  console.log(body);
});
