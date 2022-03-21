import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "微信code" })
  @IsString({ message: "不是有效的code" })
  @IsNotEmpty({ message: "code不能为Empty" })
  readonly code: string;
}
