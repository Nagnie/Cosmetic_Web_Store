import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { logger } from "./logger/logger.fn.middleware";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

import * as session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: {
            origin: "http://localhost:3000",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
        },
    });
    const configService = app.get(ConfigService);
    const port = configService.get<number>("PORT") || 3000;

    const redisClient = createClient({
        url: "redis://localhost:6379", // Change IP if deploy
    });
    redisClient.on("error", (err) => console.error("Redis Error:", err));
    await redisClient.connect();

    app.use(
        session({
            store: new RedisStore({ client: redisClient, ttl: 1800 }),
            secret: "my-secret",
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // Change "true" if HTTPS
                httpOnly: true,
                maxAge: 1000 * 60 * 30, // 30 minutes
            },
        })
    );

    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );
    app.setGlobalPrefix("api", { exclude: ["/callback"] });
    //app.use(logger); //use global middleware

    app.setBaseViewsDir(join(__dirname, "..", "views"));
    app.setViewEngine("hbs");

    const configDocument = new DocumentBuilder()
        .setTitle("Cosmetic Store API")
        .setDescription("The Cosmetic Web Store API Document")
        .setVersion("1.0")
        .addTag("cosmetic")
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, configDocument);
    SwaggerModule.setup("api-docs", app, documentFactory);

    await app.listen(port);
}
bootstrap();
