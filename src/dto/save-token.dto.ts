import { IsNotEmpty } from "class-validator";

export class SaveTokenDto {

    @IsNotEmpty()
    readonly uid: string;

    @IsNotEmpty()
    readonly token: string;
}