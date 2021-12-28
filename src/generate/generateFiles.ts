import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';

import chalk from 'chalk';

import { joinLines, pascalCase } from '../utils/strings';
import { Logger } from '../logger';
import { isSubDirectory } from '../utils/isSubDirectory';
import {Config} from './types';

interface GeneratedPaths {
    component: string;
    styles?: string;
    dir: string;
    index?: string;
}

export async function generateFiles(config: Config, componentCode: string, logger: Logger): Promise<GeneratedPaths> {
    const {
        name,
        flat,
        typescript,
        overwrite,
        baseDir,
        destination,
        separateIndex,
        separateTypes,
        exportType
    } = config;

    const pcName = pascalCase(name);

    const dirPath = path.resolve(baseDir ?? process.cwd(), destination, flat ? '.' : pcName);
    if (baseDir && !isSubDirectory(baseDir, dirPath)) {
        throw new Error(
            `The resolved directory for the component "${pcName}" falls outside the base directory:`,
        );
    }

    try {
        await fsp.mkdir(dirPath, { recursive: true });
    }
    catch (e) {
        if (e.code === 'EEXIST') {
            logger.debug(`Directory ${chalk.gray(dirPath)} already exists. Writing into it...`);
        }
        else {
            throw e;
        }
    }

    const componentFileExtension = typescript ? 'tsx' : 'jsx';
    const componentFileName = `${(flat || separateIndex) ? pcName : 'index'}.${componentFileExtension}`;
    const componentFilePath = path.join(dirPath, componentFileName);

    const indexFileName = `index.${typescript ? 'ts' : 'js'}`;
    const indexFilePath = path.join(dirPath, indexFileName);

    const typesFileName = `${pcName}.types.ts`;
    const typesFilePath = path.join(dirPath, typesFileName);

    if (!overwrite && ((
        fs.existsSync(componentFilePath)
        || (separateIndex && fs.existsSync(indexFilePath))
        || (separateTypes && fs.existsSync(typesFilePath))
    ))) {
        throw new Error(
            'Existing files would be overwritten by this command, leading to data loss.',
        );
    }

    await fsp.writeFile(componentFilePath, componentCode);

    const generatedPaths: GeneratedPaths = {
        component: componentFilePath,
        dir: dirPath
    };

    if (separateIndex && !flat) {
        const indexFileCode = joinLines(
            `export * from './${pcName}';`,
            exportType === 'default' && `export { default } from './${pcName}';`
        );

        await fsp.writeFile(indexFilePath, indexFileCode);
        generatedPaths.index = indexFilePath;
    }

    if (separateTypes) {
        const typesFileCode =  `export type ${pcName}Props = {}`;

        await fsp.writeFile(typesFilePath, typesFileCode);
        generatedPaths.index = typesFilePath;
    }

    else if(!separateIndex && !flat) {
        // The generated component *is* the index file.
        generatedPaths.index = componentFilePath;
    }

    return generatedPaths;
}