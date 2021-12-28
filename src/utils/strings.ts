import { formatWithOptions } from 'util';

export const cstr = (condition: boolean, string: string) => {
    return condition ? string : '';
};

export const indent = (str: string, num: number = 1) => {
    return str
        .split('\n')
        .map(line => '\t'.repeat(num) + line)
        .join('\n');
};

export const joinLines = (...lines: (string | false)[]): string => lines.filter(line => typeof line === 'string').join('\n');

export const isLowerCase = (str: string) => str === str.toLocaleLowerCase();

export const capitalize = (str: string) => str && (str[0].toLocaleUpperCase() + str.slice(1));

export const isKebabCase = (str: string) => str.split('-').every(isLowerCase);

export const isCamelCase = (str: string) => !str || /^[a-z][A-Za-z]*$/.test(str);

export const isPascalCase = (str: string) =>  !str || /^[A-Z][A-Za-z]*$/.test(str);

export const pascalCase = (str: string) => {
    if (isPascalCase(str)) {
        return str;
    }
    else if (isCamelCase(str)) {
        return capitalize(str);
    }
    else if (isKebabCase(str)) {
        return str.split('-')
            .map(capitalize)
            .join('');
    }

    throw RangeError('Improper string formatting');
};

export const format = (...args: unknown[]) => formatWithOptions({ colors: true }, ...args);

export const emptyLine = () => '';