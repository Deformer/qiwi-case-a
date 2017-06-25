module.exports = {
  genSmsCode: (codeLength) => Math.round(Math.random() * Math.pow(10, codeLength+1))
};