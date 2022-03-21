import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  MaxLength,
  IsOptional,
  IsNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QueryDto } from "/@/common/dto/query.dto";

export class AddAccountDto {
  @ApiProperty({
    description: "账号",
    uniqueItems: true,
  })
  @MaxLength(50, { message: "account长度不超过50" })
  @IsString({ message: "不是有效的account" })
  @IsNotEmpty({ message: "account不能为空" })
  readonly account: string;

  @ApiProperty({
    description: "管理员名称",
    uniqueItems: true,
  })
  @MaxLength(20, { message: "name长度不超过20" })
  @IsString({ message: "不是有效的数据" })
  @IsNotEmpty({ message: "name不能为空" })
  readonly name: string;

  @ApiProperty({
    description: "初始密码",
    uniqueItems: true,
  })
  @MinLength(6, { message: "password长度至少6" })
  @IsString({ message: "password不是有效的数据" })
  @IsNotEmpty({ message: "password不能为空" })
  password: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "手机号码" })
  @MinLength(11, { message: "phone长度不符" })
  @MaxLength(11, { message: "phone长度不符" })
  @IsString({ message: "phone不是有效的数据" })
  readonly phone: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "邮箱" })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: "用户状态" })
  @IsString({ message: "status必须为字符串" })
  @IsNotEmpty({ message: "status不能为空" })
  readonly status: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "权限指令" })
  @IsString({ message: "auth_key必须为字符串" })
  readonly auth_key: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "备注" })
  @IsString({ message: "des必须为字符串" })
  readonly des: string;
}

export class DelAccountDto {
  @ApiProperty({ description: "id" })
  @IsNotEmpty({ message: "id不能为空" })
  readonly id: string;
}

export class ModifyAccountDto extends DelAccountDto {
  @ApiProperty({ description: "用户状态" })
  @IsString({ message: "status必须为字符串" })
  @IsNotEmpty({ message: "status不能为空" })
  readonly status: string;
}

export class EditAccountDto extends AddAccountDto {
  @ApiProperty({
    description: "账户ID",
    uniqueItems: true,
  })
  @IsNumber()
  @IsNotEmpty({ message: "id不能为空" })
  id: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "账号" })
  @MaxLength(50, { message: "account长度不超过50" })
  @IsString({ message: "不是有效的account" })
  readonly account: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "管理员名称" })
  @MaxLength(20, { message: "name长度不超过20" })
  @IsString({ message: "不是有效的数据" })
  readonly name: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "初始密码" })
  @MinLength(6, { message: "password长度至少6" })
  @IsString({ message: "password不是有效的数据" })
  password: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "用户状态" })
  @IsString({ message: "status必须为字符串" })
  @IsNotEmpty({ message: "status不能为空" })
  readonly status: string;
}

export class EditAccountByOwnDto {
  @IsOptional()
  @ApiPropertyOptional({ description: "初始密码" })
  @MinLength(6, { message: "password长度至少6" })
  @IsString({ message: "password不是有效的数据" })
  password: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "手机号码" })
  @MinLength(11, { message: "phone长度不符" })
  @MaxLength(11, { message: "phone长度不符" })
  @IsString({ message: "phone不是有效的数据" })
  phone: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "邮箱" })
  @IsEmail()
  email: string;
}

export class GetAccountListDto extends QueryDto {
  @IsOptional()
  @ApiPropertyOptional({ description: "管理员名称" })
  @MaxLength(20, { message: "name长度不超过20" })
  @IsString({ message: "name必须为字符串" })
  readonly name: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "账号" })
  @MaxLength(50, { message: "account长度不超过50" })
  @IsString({ message: "account必须为字符串" })
  readonly account: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "用户状态" })
  @IsString({ message: "status必须为字符串" })
  readonly status: string;
}

export class LoginDto {
  @ApiProperty({ description: "账号" })
  @MaxLength(50, { message: "account长度不超过50" })
  @IsString({ message: "不是有效的account" })
  @IsNotEmpty({ message: "account不能为空" })
  readonly account: string;

  @ApiProperty({ description: "初始密码" })
  @MinLength(6, { message: "password长度至少6" })
  @IsString({ message: "password不是有效的数据" })
  @IsNotEmpty({ message: "password不能为空" })
  readonly password: string;
}
