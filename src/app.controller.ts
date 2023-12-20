import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseController } from './shared';
import { SaveTokenDto } from './dto/save-token.dto';

@Controller()
export class AppController extends BaseController {
    constructor(
        private appService: AppService
    ) {
        super();
    }

    @Post('save-token')
    async saveToken(
        @Body() dto: SaveTokenDto
    ) {
        const r = await this.appService.saveToken(dto);
        return this.send(r);
    }

    @Post('gsim/callback-notify')
    async gsimCallbackNotify(
        @Body() dto
    ) {
        const r = await this.appService.callbackGsimNotify(dto);
        return this.send(r);
    }
}
