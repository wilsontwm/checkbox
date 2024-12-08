import Knex from 'knex';

const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'migrations',
    extension: 'ts',
  },
});

export default knex;
