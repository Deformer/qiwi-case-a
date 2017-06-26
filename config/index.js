module.exports = {
  port: 3002,
  secret: 'kjwdbfwj32jnfaknljjh2',
  dbSettings: {
    database: "fintech",
    user: "admin",
    password: "admin",
    options: {
        host: "localhost",
        dialect: "postgres",
        port: 5432,
        logging: false
      }
  }
};