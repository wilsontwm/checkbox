import Knex from 'knex';

export const knexClient = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: ['knex', 'public'],
});
