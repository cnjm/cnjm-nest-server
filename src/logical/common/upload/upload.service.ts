import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as qiniu from "qiniu";
import { QiniuDto } from "./dto/qiniu.dto";
import { randomWord } from "/@/utils/common";
import { pinyin } from "pinyin-pro";
import { specialPattern } from "/@/utils/_initernal/regular";
@Injectable()
export class UploadService {
  qiniuMac: any;
  qiniuBucketName: string;
  constructor(private readonly configService: ConfigService) {
    this.qiniuBucketName = configService.get<string>("qiniu.bucketName");
    // 七牛云初始化鉴权对象mac
    this.qiniuMac = new qiniu.auth.digest.Mac(
      configService.get<string>("qiniu.accessKey"),
      configService.get<string>("qiniu.secretKey"),
    );
  }
  /**
   * 返回上传token
   * @param params 字段
   */
  async getQiniuToken(query: QiniuDto) {
    const bucket = query.bucketName || this.qiniuBucketName;
    let fileName = pinyin(query.fileName, { toneType: "none" });
    fileName = fileName.replace(specialPattern, "");
    const key = `${query.path}/${randomWord(6)}_${fileName}`;
    const token = await this.qiniuUpToken(bucket, key);
    return { token, key };
  }

  /**
   * 构建上传策略函数
   * @param params 字段
   */
  async qiniuUpToken(bucket: string, key: string) {
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: `${bucket}:${key}`,
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
    });
    return putPolicy.uploadToken(this.qiniuMac);
  }
}
