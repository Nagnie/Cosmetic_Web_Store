import { User } from "@/module/user/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
// const configService = new ConfigService();
export default new DataSource({
  type: "postgres",
  host: "88.222.212.40",
  port: 5432,
  username: "bookastaydata",
  password: "bookastaydata",
  database: "bookastay",
  migrations: ["./migrations/**"],
  entities: [
    User,
    Image,
  ],
});
