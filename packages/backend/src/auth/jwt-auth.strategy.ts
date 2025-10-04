// 导入必要的NestJS模块和装饰器
import { Injectable, UnauthorizedException } from "@nestjs/common";
// 导入Passport策略相关模块
import { PassportStrategy } from "@nestjs/passport";
// 导入JWT相关策略和提取方法
import { ExtractJwt, Strategy } from "passport-jwt";
// 导入JWT配置常量
import { jwtConstants } from "./constants";

// 定义JWT payload接口，指定token中应包含的字段
interface JwtPayload {
    username: string  // 用户名字段
    iat: number       // 签发时间
    exp: number       // 过期时间
}

@Injectable()  // 标记为可注入的服务
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        // 调用父类构造函数，配置JWT验证策略
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // 从Authorization头中提取Bearer token
            ignoreExpiration: false,  // 不忽略过期检查
            secretOrKey: jwtConstants.secret,  // 使用配置的密钥验证token
        })

        console.log("jwt验证策略已启动")
    }

    // token验证方法
    async validate(payload: JwtPayload) {
        // 检查payload是否存在且包含username字段
        if (!payload || !payload.username) {
            // 抛出无效token异常
            throw new UnauthorizedException({
                statusCode: 401,  // HTTP状态码
                message: '无效的Token',  // 错误信息
                error: 'Unauthorized'  // 错误类型
            });
        }
        
        // 检查token是否过期（passport-jwt已经做了这个检查，但我们再确认一下）
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Token已过期',
                error: 'Unauthorized'
            });
        }
        
        // 验证通过，返回用户信息对象
        return { username: payload.username };
    }
}