import { promises } from 'fs';
import { Knex } from 'knex';
import path from 'path';

interface Migrations {
  [migrationName: string]: (schemaName: string) => Knex.Migration;
}

class Migrator {
  private readonly connection: Knex;
  private readonly config: Knex.MigratorConfig;
  constructor(knex: Knex, config: Knex.MigratorConfig) {
    this.connection = knex;
    this.config = config;
  }

  async up(): Promise<void> {
    return this.connection.migrate.latest(this.config).then(async ([, migrations]) => {
      if (migrations.length > 0) {
        console.log('Successfully ran the following migrations:');
        migrations.forEach((migration) => {
          console.log(migration);
        });
      } else {
        console.log('Migrations up to date. No migrations ran.');
      }
    });
  }

  async down(): Promise<void> {
    return this.connection.migrate.rollback(this.config).then(([, migrations]) => {
      if (migrations.length > 0) {
        console.log('Successfully reverted the following migrations:');
        migrations.forEach((migration) => {
          console.log(migration);
        });
      } else {
        console.log('No migrations to be reverted.');
      }
    });
  }
}

async function loadMigrations(directory: string): Promise<Migrations> {
  let fileNames: string[];

  try {
    fileNames = await promises.readdir(directory);
  } catch {
    throw new Error(`Could not read directory "${directory}"`);
  }

  const migrations: Migrations = {};
  const skip = (filename: string) =>
    !(filename.endsWith('.js') || filename.endsWith('.ts')) || filename.endsWith('.d.ts');

  for await (const filename of fileNames) {
    if (skip(filename)) continue;

    const filePath = path.resolve(directory, filename);

    migrations[filename] = require(filePath).default; //eslint-disable-line @typescript-eslint/no-require-imports
  }

  return migrations;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadMigrationSource(directory: string, schemaName: string): Promise<Knex.MigrationSource<any>> {
  const migrations = await loadMigrations(directory);
  return {
    getMigrations() {
      return Promise.resolve(Object.keys(migrations));
    },
    getMigrationName(migration: string) {
      return migration;
    },
    async getMigration(migration: string) {
      return migrations[migration](schemaName);
    },
  };
}

export async function makeMigration(knex: Knex, name: string, path: string): Promise<void> {
  if (name?.length <= 0) throw new RangeError('Migration name is required');

  const filepath = await knex.migrate.make(name, {
    directory: path,
  });
  console.info('Migration file created:', filepath);
}

export async function createMigrator(knex: Knex): Promise<Migrator> {
  const path = `${__dirname}/scripts`;
  const schemaName = 'public';
  const source = await loadMigrationSource(path, schemaName);
  return new Migrator(knex, {
    schemaName,
    migrationSource: source,
  });
}
