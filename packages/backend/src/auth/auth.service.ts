import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { user } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from "bcryptjs"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        @InjectRepository(user) private readonly user: Repository<user>,
        private readonly JwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    // 在模块初始化时创建默认管理员账户
    async onModuleInit() {
        await this.createDefaultAdmin();
    }

    // 创建默认管理员账户
    private async createDefaultAdmin() {
        const adminUsername = this.configService.get('DEFAULT_ADMIN_USERNAME', 'admin');
        const adminPassword = this.configService.get('DEFAULT_ADMIN_PASSWORD', 'admin123');

        const existingAdmin = await this.user.findOne({
            where: { username: adminUsername }
        });

        if (!existingAdmin) {
            const adminData: CreateAuthDto = {
                username: adminUsername,
                password: adminPassword
            };

            // 对密码进行加密处理
            adminData.password = bcryptjs.hashSync(adminData.password, 10);
            await this.user.save(adminData);
            console.log('默认管理员账户已创建:');
            console.log('用户名:', adminUsername);
            console.log('密码: 请查看环境变量 DEFAULT_ADMIN_PASSWORD');
        }
    }

    // 注册
    async signup(signupData: CreateAuthDto) {

        const findUser = await this.user.findOne({
            where: { username: signupData.username }
        })
        if (findUser && findUser.username === signupData.username) return "用户已存在"
        // 对密码进行加密处理
        signupData.password = bcryptjs.hashSync(signupData.password, 10)
        await this.user.save(signupData)
        return "注册成功"
    }

    // 登录
    async login(loginData: CreateAuthDto) {

        const findUser = await this.user.findOne({
            where: { username: loginData.username }
        })

        // 没有找到
        if (!findUser) {
            return {
                code: 400,
                data: null,
                message: "用户不存在"
            };
        }

        // 找到了对比密码
        const compareRes: boolean = bcryptjs.compareSync(loginData.password, findUser.password)
        // 密码不正确
        if (!compareRes) {
            return {
                code: 400,
                data: null,
                message: "密码不正确"
            };
        }

        const payload = { username: findUser.username }

        return {
            code: 200,
            data: {
                username: findUser.username,
                id: findUser.id,
                access_token: this.JwtService.sign(payload)
            },
            message: "登录成功"
        };

    }

}


