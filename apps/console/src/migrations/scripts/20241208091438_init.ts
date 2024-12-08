import type { Knex } from 'knex';

export default (schemaName: string): Knex.Migration => ({
  async up(knex: Knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm');
    await knex.raw('CREATE EXTENSION IF NOT EXISTS btree_gin');

    await knex.schema.withSchema(schemaName).createTableIfNotExists('tasks', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.timestamp('due_date', { useTz: true }).notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
      table.timestamp('deleted_at', { useTz: true });

      table.index('due_date', 'due_date_idx');
      table.index('created_at', 'created_at_idx');
      table.index('name', 'name_idx', 'gin');
    });
  },
  async down(knex: Knex) {
    await knex.schema.withSchema(schemaName).dropTableIfExists('tasks');
  },
});
