import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService {
    private redisClient: RedisClientType;

    constructor(
        private configService: ConfigService
    ) {
        this.redisClient = createClient({
            url: configService.get<string>("REDIS_URL")
        });

        this.redisClient.on("error", (err) => {
            console.error("Redis err: ", err);
        })

        this.redisClient.connect();
    }

    async set(key: string, data: any, ttl: number = 900) {
        await this.redisClient.set(key, JSON.stringify(data), {
            EX: ttl
        });
    }

    async get(key: string) {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : "";
    }

    async del(key: string) {
        await this.redisClient.del(key);
    }
    
    async incr(key: string) {
        return await this.redisClient.incr(key);
    }

    async createSet(key: string, values: string[]) {
        return await this.redisClient.sAdd(key, values);
    }

    async addToSet(key: string, values: string[]) {
        return await this.redisClient.sAdd(key, values);
    }

    async removeFromSet(key: string, values: string[]) {
        return await this.redisClient.sRem(key, values);
    }

    async getSetMembers(key: string) {
        return await this.redisClient.sMembers(key);
    }
}
