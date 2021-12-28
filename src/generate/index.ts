
import yargs, { BuilderCallback, CommandModule } from 'yargs';
import { pick } from 'rhax';


import { logger } from '../logger';
import { getTSConfig } from '../utils/getTSConfig';
import { format } from '../utils/strings';
import {Config} from './types';
import {run} from './run';

const builder = async (yargs: yargs.Argv<{ debug: boolean}>) => {
    const { tsConfig } = await getTSConfig();

    return yargs.positional('name', {
        desc: 'The name of the component to be generated',
        type: 'string',
        demandOption: true
    })
        .config({})
        .options({
            typescript: {
                type: 'boolean',
                alias: 'ts',
                desc: 'Whether to use Typescript',
                default: !!tsConfig
            },
            flat: {
                type: 'boolean',
                desc: 'Whether to apply in current dir (true) or create a new dir (false)',
                default: false
            },
            'import-react': {
                alias: 'importReact',
                type: 'boolean',
                default: tsConfig?.compilerOptions?.jsx ? !/^react-jsx/.test(tsConfig.compilerOptions.jsx) : true,
                desc: 'Whether to import React.'
            },
            overwrite: {
                type: 'boolean',
                default: false
            },
            'base-dir': {
                alias: 'baseDir',
                type: 'string',
                desc: 'Path to a base directory which components should be genenrated in or relative to.',
            },
            'destination': {
                alias: 'dest',
                type: 'string',
                desc: 'The path in which the component folder/files should be generated, relative to baseDir.',
                default: '.'
            },
            'export-type': {
                alias: 'exportType',
                choices: ['named', 'default'], // If a valid use case arise, 'none' can be added as an option.
                desc: 'Whether to use a named export or a default export for the component.',
                default: 'named'
            },
            'separate-index': {
                alias: 'separateIndex',
                type: 'boolean',
                default: true
            },
            'separate-types': {
                alias: 'separateTypes',
                type: 'boolean',
                default: true
            },
        } as const);
};


type GenerateCommand = (typeof builder) extends BuilderCallback<{ debug: boolean }, infer R> ? CommandModule<{ debug: boolean }, R> : never

export const generateCommand: GenerateCommand = {
    command: 'generate <name> [options]',
    aliases: ['gen'],
    describe: 'Generate a component',
    builder,
    handler: async argv => {
        const config: Config = {
            name: argv.name as string,
            ...pick(['children', 'typescript', 'flat', 'styling', 'debug', 'overwrite', 'destination', 'declaration', 'memo'], argv),
            importReact: argv['import-react'],
            baseDir: argv['base-dir'],
            exportType: argv['export-type'],
            separateIndex: argv['separate-index'],
            separateTypes: argv['separate-types']
        };

        logger.debug(
            'Generating component...',
            `config: ${format(config)}`
        );

        await run(config, logger);
    }
};