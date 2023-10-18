import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new RpcException({
        error: 'Unauthorized',
        message: 'Token is invalid',
        statusCode: 401,
      });
    }
    if (!user.activated) {
      throw new RpcException({
        error: 'Unauthorized',
        message: 'User is not activated',
        statusCode: 401,
      });
    }
    return user;
  }
}
