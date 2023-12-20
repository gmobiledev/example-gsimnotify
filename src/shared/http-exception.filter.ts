
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { LogsApi } from './logs-api';
import { RESPONSE_CODE } from './constant';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
   
  ) {

  }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log(exception);
    //ghi log ngoai le loi
    if(!(exception instanceof HttpException) && exception && exception.config) {
      let logData = new LogsApi();    
      logData.source = process.env.PREFIX_LOGS_SERVICE;

      logData.response = JSON.stringify(exception);
      logData.short_message = exception.config.url;
      console.log(logData);
    }
    
    const excep: any = exception instanceof HttpException ? exception.getResponse() : null;
    // let message = excep ? excep.message : 'Đã có lỗi xảy ra vui lòng thử lại sau #5';
    let code = excep && excep.code ? excep.code : RESPONSE_CODE.EXCEPTION;
    let message = excep ? excep.message : 'Hệ thống bận, vui lòng thử lại sau..';
    if(!excep && exception.toString().indexOf('Duplicate entry') !== -1) {
      message = 'Duplicate dữ liệu';
      code = RESPONSE_CODE.DUPLICATE_ENTRY
    }
    if(excep && Array.isArray(excep.message)){
      message = excep.message.filter(x=> x != "")
      message = message[0];
    }
    if(!message && excep){
      message = excep.errors?.message;
    }
    if(!message && exception instanceof HttpException){
      message = exception.getResponse();
    }
    response
      .status(status)
      .json({
        status: 0,
        code: code,
        message: message,
        data: null,
      });
  }
}