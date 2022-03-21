import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class QiniuDto {
  @IsOptional()
  @ApiPropertyOptional({ description: "桶名" })
  @IsString({ message: "bucketName不是有效的数据" })
  readonly bucketName: string;

  @IsOptional()
  @ApiPropertyOptional({ description: "目录" })
  @IsString({ message: "path不是有效的数据" })
  readonly path: string;

  @ApiProperty({ description: "fileName" })
  @IsString({ message: "不是有效的fileName" })
  @IsNotEmpty({ message: "fileName不能为空" })
  readonly fileName: string;
}
