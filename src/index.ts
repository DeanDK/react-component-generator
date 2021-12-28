import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {logger} from './logger';
import {pkgJson} from './utils/pkgJson';
import {generateCommand} from './generate';

logger.info(`React Component Generator ${pkgJson.version}`);

yargs(hideBin(process.argv))
    .option('debug', {
        type: 'boolean',
        default: false,
        global: true
    })
    .command(generateCommand)
    .wrap(yargs.terminalWidth())
    .recommendCommands()
    .strict()
    .demandCommand(1, 'Please specify a command')
    .parseAsync();
