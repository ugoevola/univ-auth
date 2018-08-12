import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsDefined, IsString } from '../../node_modules/class-validator';

export class CredentialDto {

  @ApiModelProperty()
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiModelProperty()
  @IsString()
  @IsDefined()
  password: string;
}
