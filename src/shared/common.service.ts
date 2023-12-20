const fs = require('fs');
const crypto = require('crypto');
import { Injectable } from "@nestjs/common";
import { join } from "path";
import { TELCO } from "./constant";
import { ApiRes } from "./common.interface";

@Injectable()
export class CommonService {
    apiRes(data: Object = null, code: string = 'SUCCESS', message: string = 'Thành công', status: number = 1): ApiRes {
        let res: ApiRes = {
            status: status,
            code,
            message,
            data
        };
        return res;
    }
    getSignature(data, privateKey) {
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(data);
        sign.end();
        const signature = sign.sign(privateKey);
        console.log("Signature: ", signature.toString('base64'));
        return signature.toString('base64');
    }
    sign(signData: string, type, filePath = '/secret/payment_private.pem') {
        let privateKey;
        if (type == 'path') {
            privateKey = fs.readFileSync(join(process.cwd(), filePath), 'utf-8');
        }
        if (type == 'text') {
            privateKey = filePath;
        }

        const signature = this.getSignature(signData, privateKey);
        return signature;
    }

    verifyRsaPublicKey(plainText: string, signature: string, relativeOrAbsolutePathToPublicKey: string = '/secret/payment_public.pem', publicKey: string = null) {
        if (!publicKey) {
            publicKey = fs.readFileSync(join(process.cwd(), relativeOrAbsolutePathToPublicKey), "utf8");
        }
        let verifier = crypto.createVerify("RSA-SHA256");
        verifier.update(plainText);
        return verifier.verify(publicKey, signature, "base64");
    }

    genHolderNameVirtualAccount(name) {
        //Đổi ký tự có dấu thành không dấu
        name = name.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        name = name.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        name = name.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        name = name.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        name = name.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        name = name.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        name = name.replace(/đ/gi, 'd');
        let result = name.toUpperCase();
        return result;
    }

    convertMobileToInternational(prefix, mobile) {
        if (mobile.substring(0, 2) == prefix) {
            return mobile;
        }
        if (mobile.charAt(0) === '0') {
            mobile = mobile.substring(1)
        }
        return prefix + mobile;
    }

    checkTelcoVn(mobile) {
        const subtr = this.convertMobileToInternational('84', mobile).substring(0, 4);
        let telco = '';
        if (['8486', '8496', '8497', '8432', '8433', '8434', '8435', '8436', '8437', '8438', '8439'].includes(subtr)) {
            telco = 'Viettel'
        }
        if (['8491', '8494', '8488', '8483', '8484', '8485', '8481', '8482'].includes(subtr)) {
            telco = 'Vinaphone'
        }
        if (['8489', '8490', '8493', '8470', '8479', '8477', '8476', '8478'].includes(subtr)) {
            telco = 'Mobifone'
        }
        if (['8492', '8456', '8458'].includes(subtr)) {
            telco = 'Vietnamobile'
        }
        if (['8499', '8459'].includes(subtr)) {
            telco = 'Gmobile'
        }
        return telco;
    }


    getGmobileTelco(mobile) {
        let telco = "OTHER"; //09965 09966 09967
        if (mobile.substring(0, 4) == "0995") {
            telco = "Vietnamobile"
        } else if (["09968", "09969"].indexOf(mobile.substring(0, 5)) > -1) {
            telco = "Mobifone"
        } else if (["09960", "09961", '09962', "09963", "09964", "09965", "09966", "09967", "05981", "05983", "05985", "05986", "05987", "05988", "05989"].indexOf(mobile.substring(0, 5)) > -1) {
            telco = TELCO.GSIM
        } else if (["0592", '0593', "0599", "0993", "0994", "0997"].indexOf(mobile.substring(0, 4)) > -1) {
            telco = "Vinaphone"
        } else if (process.env.NODE_ENV != 'production' && ["0598"].indexOf(mobile.substring(0, 4)) > -1) {
            telco = TELCO.GSIM;
        }
        return telco;
    }

    /**
     * 
     * 
     * @param filePath - Path của cert
     * @param password - mật khẩu file cert
     * @param body - Nội dung push trong payload
     * @param deviceId - id của thiết bị
     */
    async pushNotifyIos(filePath, password, body, deviceId, production = false): Promise<any> {
        let apn = require('apn');
        let apnProvider = new apn.Provider({
            key: fs.readFileSync(join(process.cwd(), filePath), "utf8"),
            cert: fs.readFileSync(join(process.cwd(), filePath), "utf8"),
            passphrase: password,
            production: production
        });
        var note = new apn.Notification();

        // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        // note.badge = 3;
        // note.sound = "ping.aiff";
        // note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.rawPayload = body;
        return new Promise((resolve, reject) => {
            apnProvider.send(note, deviceId).then((result) => {
                // see documentation for an explanation of result
                console.log(result);
                console.log(JSON.stringify(result));

                resolve(result);
            }).catch((error) => {
                console.log(error);
                console.log(JSON.stringify(error));
                reject(error)
            });
        })
    }

    randomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
}