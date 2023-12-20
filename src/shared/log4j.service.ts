import { Injectable } from "@nestjs/common";

const log4js = require("log4js");

export class Log4JService {
    loggerError: any;
    loggerDebug: any;
    loggerApp: any;
    loggerNofity: any;
    loggerSms: any;
    constructor(
        
    ) {
        log4js.configure({
            "pm2": true,
            "disableClustering": true,
            "appenders": {
                "access": {
                    "type": "dateFile",
                    "filename": "logs/access.log",
                    "pattern": ".yyyy-MM-dd"
                },
                "app": {
                    "type": "file",
                    "filename": "logs/app.log",
                    "pattern": "-yyyy-MM-dd", "alwaysIncludePattern": true, "keepFileExt": true,
                    "maxLogSize": 10485760,
                    "numBackups": 3
                },
                "notify": {
                    "type": "file",
                    "filename": "logs/notify-weakup.log",
                    "pattern": "-yyyy-MM-dd", "alwaysIncludePattern": true, "keepFileExt": true,
                    "maxLogSize": 10485760,
                    "numBackups": 3
                },
                "sms": {
                    "type": "file",
                    "filename": "logs/sms.log",
                    "pattern": "-yyyy-MM-dd", "alwaysIncludePattern": true, "keepFileExt": true,
                    "maxLogSize": 10485760,
                    "numBackups": 3
                },
                "debug": {
                    "type": "file",
                    "filename": "logs/debug.log",
                    "pattern": "-yyyy-MM-dd", "alwaysIncludePattern": true, "keepFileExt": true,
                    "maxLogSize": 10485760,
                    "numBackups": 3
                },
                "error": { "type": "dateFile", "filename": "logs/error.log", "pattern": "-yyyy-MM-dd", "alwaysIncludePattern": true, "keepFileExt": true },
                "error-filter": { "type": "logLevelFilter", "appender": "error", "level": "error", "maxLevel": "error" }
            },
            "categories": {
                "default": { "appenders": ["app"], "level": "DEBUG" },
                "notify": { "appenders": ["notify"], "level": "Debug" },
                "sms": { "appenders": ["sms"], "level": "DEBUG" },
                "http": { "appenders": ["access"], "level": "DEBUG" },
                "error": { "appenders": ["error", "error-filter"], "level": "error" }
            }
        });
        this.loggerApp = log4js.getLogger("app");
        this.loggerDebug = log4js.getLogger("debug");
        this.loggerError = log4js.getLogger("error");
        this.loggerNofity = log4js.getLogger("notify");
        this.loggerSms = log4js.getLogger("sms");
    }

    async debug(message) {
        this.loggerApp.debug(message);
    }

    async error(message) {
        this.loggerError.error(message);
    }

    async logNotify(message){
        this.loggerNofity.log(message);
    }
    async logSms(message){
        this.loggerSms.log(message);
    }
}