import { Module } from '@nestjs/common';
import { FcmLibService } from './fcm-lib.service';

@Module({
  providers: [FcmLibService],
  exports: [FcmLibService],
})
export class FcmLibModule {}
