import { Logger } from '../logger';

import { generateFiles } from './generateFiles';
import { generateReactCode } from './generateReactCode';
import {Config} from './types';

export async function run(config: Config, logger: Logger) {
    const componentCode = generateReactCode(config);

    try {
        const generatedPaths = await generateFiles(config, componentCode, logger);

        const uniquePaths = [...new Set(Object.values(generatedPaths))];
        logger.info(
            'Generation successful.',
            'Generated files:',
            ...uniquePaths
        );
    }
    catch (e) {
        throw new Error(e);
    }
}