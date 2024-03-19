import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntitiy } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateUserParams, UpdateUserParams } from './types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntitiy)
    private userRepository: Repository<UserEntitiy>,
    private readonly jwtService: JwtService,
  ) {}

  getUser() {
    return this.userRepository.find();
  }

  getUserByTz(tz: number) {
    return this.userRepository.findOne({ where: { tz: tz } });
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  async validateUser(tz: number, pass: string): Promise<any> {
    const user = this.getUserByTz(tz);

    const isMatch = await bcrypt.compare(pass, (await user).password);
    if (isMatch) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async register(tz: number, password: string): Promise<any> {
    const existingUser = await this.getUserByTz(tz);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // You may want to hash the password before saving it
    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.createUser({
      tz,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(tz: number, password: string): Promise<{ access_token: string }> {
    await this.validateUser(tz, password);
    return await this.jwtSign(tz);
  }

  async jwtSign(tz: number): Promise<{ access_token: string }> {
    const payload = { tz };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
