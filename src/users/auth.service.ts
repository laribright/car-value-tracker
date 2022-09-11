import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private UsersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.UsersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exists');
    }
    // Encrypt Password
    const salt = randomBytes(12).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    // Create a new new
    const user = await this.UsersService.create(email, result);
    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.UsersService.find(email);

    if (!user) throw new NotFoundException('User not found');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Invalid login details');

    return user;
  }
}
