import { cstr, indent } from './strings';

export function createImport(module: string, importType?: 'named' | 'default' | 'composite', whatToImport?: string | string[]): string {
    if (!whatToImport) {
        return `import '${module}';`;
    }

    else if(importType === 'composite') {
        const [defaultImport, ...namedImports] = whatToImport as string[];
        return `import ${defaultImport}, { ${namedImports.join(', ')} } from '${module}';`;
    }

    else if (importType === 'named') {
        const namedImports = Array.isArray(whatToImport) ? whatToImport.join(', ') : whatToImport;
        return `import { ${namedImports} } from '${module}';`;
    }

    return `import ${whatToImport} from '${module}';`;
}

export const declareFunction = (name: string, params: string = '', body: string = '', exported: boolean = false) =>
    `${cstr(exported, 'export ')}function ${name}(${params}) {${body ? `\n${indent(body)}\n` : ' '}}`;
