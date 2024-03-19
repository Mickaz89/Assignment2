import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'tz',
    });
  }

  async validate(tz: number, password: string): Promise<any> {
    const user = await this.userService.validateUser(tz, password);
    console.log('VALIDATE ', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
