import ora from 'ora';

export interface IconData {
  start: string,
  finish: string
}

async function sleep(second: number) {
  return new Promise(resolve => setTimeout(resolve, second * 1000));
}

export async function createIcon(data: IconData[]) {
  for (let i = 0; i < data.length; i++) {
    const spinner = ora(data[i].start).start();
    await sleep(2);
    spinner.succeed(data[i].finish);
  }
}
