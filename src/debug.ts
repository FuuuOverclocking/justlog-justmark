import chalk from 'chalk';

const enum DebugLevel {
    Info,
    Warn,
    Error,
    None = Error + 1,
}

let currDebugLevel = DebugLevel.Info;

function log(level: DebugLevel, msg: string): void {
    if (level < currDebugLevel) return;
    switch (level) {
        case DebugLevel.Info:
            console.log(chalk.bold.cyan('[JustMark]: ') + msg);
            break;
        case DebugLevel.Warn:
            console.log(chalk.bold.yellow('[JustMark]: ') + msg);
            break;
        case DebugLevel.Error:
            console.log(chalk.bold.red('[JustMark]: ') + msg);
            break;
    }
}

export const debug = {
    info(msg: string) {
        log(DebugLevel.Info, msg);
    },
    warn(msg: string) {
        log(DebugLevel.Warn, msg);
    },
    error(msg: string) {
        log(DebugLevel.Error, msg);
    },
};

export function panic(msg?: string): never {
    if(msg) debug.error(msg);
    process.exit(-1);
}

export function panicIfNot(condition: boolean, msg: string): void {
    if (condition) return;
    debug.error(msg);
    process.exit(-1);
}