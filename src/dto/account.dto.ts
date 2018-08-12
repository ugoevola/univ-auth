import { IAccount } from '../repository/schema/account.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Role } from '../repository/schema/role.enum';
import { IsString, IsDefined, IsEmail, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class AccountDto implements IAccount {

  @IsString()
  @ApiModelProperty()
  _id: string;

  @IsEmail()
  @IsDefined()
  @ApiModelProperty()
  email: string;

  @IsString()
  @IsDefined()
  @ApiModelProperty()
  password: string;

  @IsDefined()
  @IsEnum(Role)
  @ApiModelProperty()
  role: Role;

  @IsString()
  @IsDefined()
  @ApiModelProperty()
  name: string;

  @IsString()
  @IsDefined()
  @ApiModelProperty()
  givenName: string;

  @IsString()
  @Type(() => Date)
  @ApiModelProperty()
  lastLoginAttempt: Date;

  @IsDate()
  @Type(() => Date)
  @ApiModelProperty()
  lastLoginSuccessful: Date;

  @ApiModelProperty()
  @Type(() => Date)
  @IsDate()
  createdOn: Date;

  @ApiModelProperty()
  @Type(() => Date)
  @IsDate()
  updatedOn: Date;
}
