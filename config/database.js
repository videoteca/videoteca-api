const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

// change host and port to your redis cfgs:
const redisHost = 'localhost';
const redisPort = 6379;

//CREATE REDIS CLIENT
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort
});

var configs = {
  database: {
    prod: {
      uri: process.env.DATABASE_URL,
      dialect: 'postgres',
      protocol: 'postgres'
    },
    dev: {
      uri: process.env.DATABASE_URL,
      dialect: 'postgres',
      protocol: 'postgres',
      // // others configs for debug:
      // database: 'postgres',
      // username: 'postgres',
      // password: 'postgres',
      // host: 'database',
      // post: 5432
    },
    test: {
      dialect: 'mysql',
      database: 'test',
      username: 'root',
      password: ''
    }
  }
}

if (process.env.REDIS_HOST) {
  configs.session = {
    secret: 'someSecretText',
    store: new RedisStore({
      // pass the session store settings, see the session store docs
      client: redisClient,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 31557600, // 1 year, this is set by secconds
      db: process.env.REDIS_DB
    }),
    resave: false, // don't save session if unmodified
    saveUninitialized: false
  }
}

module.exports = configs