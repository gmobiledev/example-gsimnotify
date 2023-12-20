import { ApiRes } from './../shared/common.interface';
import * as moment from 'moment';
export class BaseController {

  constructor() {

  }

  send(data: Object = null, code: string = 'SUCCESS', message: string = 'Thành công', status: number = 1): ApiRes {
    let res = {
      status: status,
      code,
      message,
      data
    };
    console.log("Response", moment.unix(Math.floor(new Date().getTime() / 1000)).format('YYYY-MM-DD HH:mm:ss'), res);
    return res;
  }

  error(message: string = 'Thất bại', data: Object = null, code: string = 'ERROR'): ApiRes {
    let res = {
      status: 0,
      code,
      message,
      data
    };
    return res;
  }
}