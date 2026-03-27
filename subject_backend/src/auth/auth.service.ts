import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from 'src/users/dto';
import { CreateUserDto } from 'src/users/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.register(dto);
    return {
      message: 'Usuario registrado correctamente',
      user,
    };
  }

  async login(dto: LoginUserDto) {
      const user = await this.usersService.validateUser(dto);
      const payload = { sub: user.id, email: user.email };

      
      const accessTokenExpiresIn = 3600; 
      const refreshTokenExpiresIn = 60 * 60 * 24 * 7; 

      
      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpiresIn,
        secret: process.env.JWT_SECRET || '4fG7!mQ9zR2xWv8L',
      });

      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpiresIn,
        secret: process.env.JWT_REFRESH_SECRET || 'myRefreshSecretKey123!',
      });

      const { password, country, ...safeUser } = user;

      return {
        access_token,
        refresh_token,
        expires_in: accessTokenExpiresIn,
        expires_at: new Date(Date.now() + accessTokenExpiresIn * 1000).toISOString(),
        user: safeUser,
      };
    }


  async validateUser(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException('Token inválido');
    return user;
  }

  async logout() {
    return {
      message: 'Logout exitoso. Elimina el token del cliente.',
      timestamp: new Date().toISOString()
    };
  }


  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'myRefreshSecretKey123!',
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          expiresIn: 3600, 
          secret: process.env.JWT_SECRET || '4fG7!mQ9zR2xWv8L',
        },
      );

      return {
        access_token: newAccessToken,
        expires_in: 3600,
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

}
