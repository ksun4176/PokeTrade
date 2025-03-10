import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  private async logToFile(entry: string) {
    const fileName = `${new Date().toJSON().slice(0,10)}.log`;
    const formattedDate = Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/New_York',
    }).format(new Date());
    const formattedEntry = `${formattedDate}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))){
          await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
      }
      await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', fileName), formattedEntry)
    }
    catch (error) {
      console.error(error);
    }
  }
  override error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;
    this.logToFile(entry);
    super.error(message, stackOrContext);
  }
}
