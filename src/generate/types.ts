export interface Config {
    name: string;
    typescript: boolean;
    flat: boolean;
    importReact: boolean;
    debug: boolean;
    overwrite: boolean;
    baseDir?: string;
    destination: string;
    exportType: 'named' | 'default'
    separateIndex: boolean;
    separateTypes: boolean;
}