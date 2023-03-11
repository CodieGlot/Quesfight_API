import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './templates/CreateUserDto';
import { User } from './templates/UserEntity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findAllUSers() {
    return await this.usersRepository.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    if (
      (await this.usersRepository.findOneBy({
        username: createUserDto.username,
      })) ||
      (await this.usersRepository.findOneBy({ email: createUserDto.email }))
    )
      return null;
      // 19 => 25: code chưa clean
      // sau khi e fix comment dòng 39 xong có thể sử dụng
      // const existUser = await this.findUserByEmailOrUserName(createUserDto);

      // if (existUser) {
        // return ConflictException
      //}

    createUserDto.password = await hashPassword(createUserDto.password);

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(createUserDto);
  }

  async findUserById(id: string) {
    return await this.usersRepository.findOneBy({ id: id });
  }

  // có thể viết 1 function gộp cả 2 function này lại, sử dụng createQueryBuilder
  async findUserByUsername(username: string) {
    return await this.usersRepository.findOneBy({ username: username });
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email: email });
  }
}
