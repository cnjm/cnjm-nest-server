import { IsOptional, Max } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryDto {
  @IsOptional()
  @ApiPropertyOptional({ description: "当前页数" })
  readonly page: number;

  @IsOptional()
  @ApiPropertyOptional({ description: "每页条数" })
  readonly pageSize: number;
}
