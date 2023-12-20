import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SaveTokenDto } from './dto/save-token.dto';
import { FcmLibService } from '@app/fcm-lib';

@Injectable()
export class AppService {
    public constructor(
        @InjectRepository(UserEntity)
        private readonly userRepos: Repository<UserEntity>,
        private readonly fcmLibService: FcmLibService
    ) {

    }

    async saveToken(dto: SaveTokenDto) {
        console.log(dto);
        let user = await this.userRepos.findOne({where: {uid: dto.uid}});
        if(!user) {
            user = new UserEntity();
            user.uid = dto.uid;
        }
        user.token = dto.token;
        user = await this.userRepos.save(user);
        return user;
    }

    async callbackGsimNotify(dto) {
        console.log(dto);
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
                timestamp: dto.data.timestamp
            }
          }]
          console.log(messages);
          const r = await this.fcmLibService.sendFirebaseMessagesWithoutNotification(messages);
          console.log(JSON.stringify(r));
          return { firebase_response: r, firebase_token: user.token };
    }
     
}
