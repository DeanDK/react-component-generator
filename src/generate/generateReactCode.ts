import {
    ComponentComposer
} from './ComponentComposer';

import {Config} from './types';

export function generateReactCode(config: Config): string {
    return new ComponentComposer(config).compose();
}