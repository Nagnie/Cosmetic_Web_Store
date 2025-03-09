import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ImageModule } from './module/image/image.module';
import { MinioService } from './minio/minio.service';
import { RolesGuard } from './auth/guard/role.guard';
import { BrandModule } from './module/brand/brand.module';
import { ProductModule } from './module/product/product.module';
import { CategoryModule } from './module/category/category.module';
import { SubcategoryModule } from './module/subcategory/subcategory.module';
import { OrderModule } from './module/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        logging: ['query', 'error'],
        extra: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 10000,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ImageModule,
    BrandModule,
    ProductModule,
    CategoryModule,
    SubcategoryModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    MinioService,
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {

  }
  configure(consumer: MiddlewareConsumer) {

  }
}
