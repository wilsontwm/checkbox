import inquirer from 'inquirer';

export async function select(message: string, choices: { name: string; value: string }[]): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: 'select',
      name: 'action',
      message,
      choices,
    },
  ]);

  return answers.action as string;
}

export async function input(message: string): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'action',
      message,
    },
  ]);

  return (answers.action as string).trim();
}

export async function confirm(message: string): Promise<boolean> {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'action',
      message,
    },
  ]);

  return answers.action as boolean;
}
