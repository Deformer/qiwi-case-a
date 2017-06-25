module.exports = {
  port: 3001,
  secret: 'kjwdbfwj32jnfaknljjh2',
  dbSettings: {
    url: 'mongodb://ds064649.mlab.com:64649/fintech',
    options: {
      db: { native_parser: true },
      server: { poolSize: 5 },
      user: 'admin',
      pass: 'admin'
    }
  }
};