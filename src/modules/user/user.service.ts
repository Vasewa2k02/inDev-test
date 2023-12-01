import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { ExceptionMessage } from 'src/common/enums/exception-message.enum';
import { SALT } from 'src/common/constants/env-variables';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserResponse } from './response/user.response';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (user) {
      throw new ConflictException(ExceptionMessage.userExists);
    }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      Number(this.configService.get(SALT)),
    );

    await this.userRepository.save(new User(createUserDto));
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestException(ExceptionMessage.userNotFound);
    }

    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException(ExceptionMessage.userNotFound);
    }

    return user;
  }

  async getUserInfo(id: number): Promise<UserResponse> {
    const user = await this.getUserById(id);

    return new UserResponse(user);
  }

  async update(id: number, userDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(id, userDto);
  }
}
