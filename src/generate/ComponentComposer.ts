import {  createImport, declareFunction } from '../utils/codegenUtils';
import {  emptyLine, indent, joinLines, pascalCase } from './../utils/strings';
import {Config} from './types';

export class ComponentComposer {
    constructor(private readonly config: Config) { }

    get componentName() {
        return pascalCase(this.config.name);
    }

    getJSX() {
        return `<div></div>`;
    };

    getComponentBody() {
        return joinLines(
            emptyLine(),
            'return (',
                 indent(this.getJSX()),
            ');'
        );
    }

    getReactImport() {
        return createImport('react', 'default', 'React');
    }

    getImportBlock() {
        const { importReact } = this.config;
        const createReactImport = importReact;

        return joinLines(
            createReactImport && this.getReactImport(),
        );
    }

    getComponentFunctionDeclaration() {
        return declareFunction(
            this.componentName,
            '',
            this.getComponentBody(),
            this.config.exportType === 'named'
        );
    }

    compose() {
        return joinLines(
            this.getImportBlock() || false,
            emptyLine(),

            this.getComponentFunctionDeclaration(),
            emptyLine(),
        );
    }
}
