import { ApiModelProperty } from '@nestjs/swagger';
import { Role } from '../repository/schema/role.enum';
import { IsString, IsDefined, IsEmail, IsDate, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';

export class AccountDto  {

  @IsString()
  @ApiModelProperty()
  @Transform((id: string) =>  new ObjectID(id), {toClassOnly : true})
  _id?: ObjectID;

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
  @Type(() => Date)
  @ApiModelProperty()
  lastLoginAttempt?: Date;

  @IsDate()
  @Type(() => Date)
  @ApiModelProperty()
  lastLoginSuccessful?: Date;

  @ApiModelProperty()
  @Type(() => Date)
  @IsDate()
  createdOn?: Date;

  @ApiModelProperty()
  @Type(() => Date)
  @IsDate()
  updatedOn?: Date;
}
