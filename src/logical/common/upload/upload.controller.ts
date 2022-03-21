import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { QiniuDto } from "./dto/qiniu.dto";
import { UploadService } from "./upload.service";
import { RolesGuard } from "../../admin/auth/roles.guard";

@ApiTags("upload")
@Controller("upload")
@UseGuards(RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {
    //
  }

  @Get("getQiniuToken")
  @ApiOperation({ summary: "上传文件到七牛云" })
  async getQiniuToken(@Query() query: QiniuDto): Promise<any> {
    return this.uploadService.getQiniuToken(query);
  }
}
