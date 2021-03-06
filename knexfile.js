// Update with your config settings.

module.exports = {

  development: {
    client: 'postgres',
    connection: {
      database: 'reddit_db'
    }
  },

    test: {
    client: 'postgres',
    connection: {
      database: 'reddit_test_db'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.HEROKU_POSTGRESQL_AQUA_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
