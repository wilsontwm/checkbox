import { program } from 'commander';
import { cli as migrationCli } from './migrations';
import { select } from './utils';

const choiceOfActions = [{ name: 'Database Migration', value: 'db_migration' }];

program
  .version('1.0.0')
  .description('Checkbox CLI')
  .action(async () => {
    const action = await select('What do you want to do today?', choiceOfActions);

    switch (action) {
      case 'db_migration':
        await migrationCli();
        break;
    }

    console.log('End of program');
    process.exit(0);
  });

program.parse(process.argv);
