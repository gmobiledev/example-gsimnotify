import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SaveTokenDto } from './dto/save-token.dto';
import { FcmLibService } from '@app/fcm-lib';
import { CommonService } from './shared/common.service';

@Injectable()
export class AppService {
    public constructor(
        @InjectRepository(UserEntity)
        private readonly userRepos: Repository<UserEntity>,
        private readonly fcmLibService: FcmLibService,
        private readonly commonService: CommonService,
    ) {

    }

    async saveToken(dto: SaveTokenDto) {
        console.log(dto);
        let user = await this.userRepos.findOne({where: {uid: dto.uid}});
        if(!user) {
            user = new UserEntity();
            user.uid = dto.uid;
        }
        user.os = dto.os;
        user.token = dto.token;
        user = await this.userRepos.save(user);
        return user;
    }

    async callbackGsimNotify(dto) {
        console.log(dto);
        let dataVerify = `gateway=${dto.gateway}&merchant_id=${dto.merchant_id}&caller=${dto.data.caller}&callee=${dto.data.callee}`;
        console.log(dataVerify);
        let rVerify;
        try {
            rVerify = this.commonService.verifyRsaPublicKey(dataVerify, dto.signature, '/secret/gsim_notify.public.pem');
        } catch (error) {
            throw new HttpException({ message: 'Chữ ký không hợp lệ' }, 400);
        }
        if (!rVerify) {
            throw new HttpException({ message: 'Chữ ký không hợp lệ' }, 400);
        }
        const user = await this.userRepos.findOne({where: {uid: dto.data.uid}});
        if(!user) {
            throw new HttpException("User không tồn tại", HttpStatus.BAD_REQUEST)
        }

        let messages = [{
            token: user.token,
            title: user.uid,
            message: `${dto.data.caller} đang gọi tới`,
            data: {
                source: 'GSIMSDK',
                type: dto.data.status,
                caller: dto.data.caller,
                callee: dto.data.callee,
                call_id: dto.data.call_id ? dto.data.call_id : '',
                message: `${dto.data.caller} đang gọi tới`,
                timestamp: dto.data.timestamp,
                ring_time: dto.data.ring_time ? dto.data.ring_time + '' : '0'
            }
          }]
          console.log(messages);
          let r;
          console.log(user);
          if(user.os && user.os.toLowerCase() == 'android') {
            r = await this.fcmLibService.sendFirebaseMessagesWithoutNotification(messages);
          } else {
              r = await this.fcmLibService.sendFirebaseMessages(messages);
              console.log(JSON.stringify(r));
              const isProductionMode = process.env.NODE_ENV == 'production' ? true : false
              const rIos = await this.commonService.pushNotifyIos('/secret/Certificates_ios_gtalk.pem',
                  'Gmobile123', { "caller": dto.data.caller, "callee": dto.data.callee, "status": dto.data.status,
                  "call_id": dto.data.call_id ? dto.data.call_id : '',
                  "caller_name": dto.data.caller,
                  "caller_id_type": "string",
                  "caller_id": dto.data.call_id ? dto.data.call_id : '',
                  "uuid": "abc",
                  "has_video": "false",
                  "from_number": dto.data.caller,
                  "to_number": dto.data.callee,
                  "aps": { "alert": "incoming" } },
                  user.token, "vn.gmobile.mygmobile.voip", "voip", false);
              if (!rIos.sent || rIos.sent.length < 1) {
                  throw new HttpException({ message: "Gui notify fail" }, HttpStatus.BAD_REQUEST);
              }
              
              return { message: "success" };

          }
          
          console.log(JSON.stringify(r));
          return { firebase_response: r, firebase_token: user.token };
    }
     
}
