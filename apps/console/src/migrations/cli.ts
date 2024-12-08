import { confirm, input, select } from '../utils';
import { createMigrator, makeMigration } from '.';
import knex from './db';

export async function cli() {
  const choiceOfActions = [
    { name: 'Make new migration script', value: 'make' },
    { name: 'Run migration scripts', value: 'up' },
  ];

  const action = await select('What kind of migration do you want to do?', choiceOfActions);

  switch (action) {
    case 'make': {
      const migrationName = await input('Enter migration file name');
      await makeMigrationFile(migrationName);
      break;
    }
    case 'up': {
      const dbUrl = process.env.DATABASE_URL;
      const confirmRun = await confirm('Are you sure you want to run all migration scripts?\nDatabase URL: ' + dbUrl);
      if (!confirmRun) {
        console.log('Migration scripts not run');
        return;
      }

      await runMigrateUp();
      break;
    }
  }
}

async function runMigrateUp(): Promise<void> {
  const migrator = await createMigrator(knex);
  await migrator.up();
}

async function makeMigrationFile(migrationName: string): Promise<void> {
  await makeMigration(knex, migrationName, `${__dirname}/scripts`);
}
