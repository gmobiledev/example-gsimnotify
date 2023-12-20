import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogsApi } from './logs-api';
import * as moment from 'moment';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
    ) {
    }
    use(req: Request, res: Response, next: NextFunction) {
        // console.log('Request...', req);
        const { httpVersion, headers, method, baseUrl, params, query, body, ip } = req;
        console.log( moment.unix(Math.floor( new Date().getTime() /1000)).format('YYYY-MM-DD HH:mm:ss'), baseUrl, method, body, params, headers);
        res.on('close', () => {
            const { statusCode } = res;
            console.log(`${method} ${statusCode}`)
        });
        next();
    }
}