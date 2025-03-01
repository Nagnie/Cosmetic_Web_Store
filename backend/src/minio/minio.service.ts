// src/minio/minio.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService : ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: configService.get<string>('MINIO_ENDPOINT'),
      port: 9000,         
      useSSL: false,         
      accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: configService.get<string>('MINIO_SECRET_KEY'),
    });
    this.bucketName = configService.get<string>('MINIO_BUCKET_NAME');
  }

  async uploadFile(bucketName: string, fileName: string, fileBuffer: Buffer) {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName);
      }

      const objInfo = await this.minioClient.putObject(bucketName, fileName, fileBuffer);
      return objInfo.etag;
    } catch (error) {
      throw new Error(`Failed to upload file to MinIO: ${error.message}`);
    }
  }

  async getPresignedUrl(objectName: string): Promise<string> {
    const expires = 60 * 60;
    return this.minioClient.presignedUrl('GET', this.bucketName, objectName, expires);
  }
}
