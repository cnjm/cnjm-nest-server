import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QueryDto } from "/@/common/dto/query.dto";

export class GetAuthListDto extends QueryDto {
  @IsOptional()
  @ApiPropertyOptional({ description: "权限名称" })
  @IsString({ message: "name不是有效的数据" })
  readonly name: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "权限指令" })
  @IsString({ message: "key不是有效的数据" })
  readonly key: string;
}

export class DelAuthDto {
  @ApiProperty({ description: "权限id" })
  @IsNotEmpty({ message: "id不能为空" })
  readonly id: string;
}

export class AddAuthDto {
  @ApiProperty({ description: "权限名称" })
  @IsNotEmpty({ message: "name不能为空" })
  @IsString({ message: "name不是有效的数据" })
  readonly name: string;

  @ApiProperty({ description: "权限指令" })
  @IsNotEmpty({ message: "name不能为空" })
  @IsString({ message: "key不是有效的数据" })
  readonly key: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "权限备注" })
  @IsString({ message: "des不是有效的数据" })
  readonly des: string;
}
