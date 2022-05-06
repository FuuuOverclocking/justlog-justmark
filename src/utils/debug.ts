import chalk from 'chalk';

export enum DebugLevel {
    Info,
    Warn,
    Error,
    None = Error + 1,
}

let currDebugLevel = DebugLevel.Info;

function log(level: DebugLevel, msg: string): void {
    if (level < currDebugLevel) return;
    console.log(msg);
}

export function setDebugLevel(level: DebugLevel): void {
    currDebugLevel = level;
}

export const debug = {
    info(msg: string) {
        msg = chalk.bold.cyan('[JustMark]: ') + msg;
        log(DebugLevel.Info, msg);
    },
    warn(msg: string) {
        msg = chalk.bold.yellow('[JustMark]: ') + msg;
        log(DebugLevel.Warn, msg);
    },
    error(msg: string) {
        msg = chalk.bold.red('[JustMark]: ') + msg;
        log(DebugLevel.Error, msg);
    },
    raw: {
        info(msg: string = '') {
            log(DebugLevel.Info, msg);
        },
        warn(msg: string = '') {
            log(DebugLevel.Warn, msg);
        },
        error(msg: string = '') {
            log(DebugLevel.Error, msg);
        },
    },
    withTime: {
        info(msg: string) {
            msg =
                chalk.grey(`[${new Date().toLocaleTimeString()}] `) +
                chalk.bold.cyan('[JustMark]: ') +
                msg;
            log(DebugLevel.Info, msg);
        },
        warn(msg: string) {
            msg =
                chalk.grey(`[${new Date().toLocaleTimeString()}] `) +
                chalk.bold.yellow('[JustMark]: ') +
                msg;
            log(DebugLevel.Warn, msg);
        },
        error(msg: string) {
            msg =
                chalk.grey(`[${new Date().toLocaleTimeString()}] `) +
                chalk.bold.red('[JustMark]: ') +
                msg;
            log(DebugLevel.Error, msg);
        },
    },
};

export function panic(msg?: string): never {
    if (msg) debug.error(msg);
    process.exit(-1);
}

export function panicIfNot(condition: boolean, msg: string): void {
    if (condition) return;
    debug.error(msg);
    process.exit(-1);
}
