import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SerializedUser } from 'src/modules/users/templates/SerializedUser';
import { UsersService } from './users.service';
import { CreateUserDto } from './templates/CreateUserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  async findAllUsers() {
    // code chua clean, nen ap dung them phan trang (pagination), search
    // vi du get [users?searchTerm=${searchTerm}&page=${page}&pageSize=${page}
    // search term: vi du nhap vao "Thu", => query cac user co ten Thu, Thua, Thuan, Thuong,... vi du the :v
    // page = trang hien tai
    // page size = so luong hien thi o 1 trang
    // tham khao : https://world.optimizely.com/documentation/Items/Developers-Guide/EPiServer-Find/9/DotNET-Client-API/Searching/Pagination-Skip-and-Take/
    return (await this.usersService.findAllUSers()).map(
      (user) => new SerializedUser(user),
    );
  }

  // validation pipe co the khai bao o main.ts, de setup cho toan bo API
  @UsePipes(ValidationPipe)
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);

    if (!user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      // phân biệt các loại exception
      // nestjs có hỗ trợ BadRequestException
      // //https://tamle.dev/2021/04/02/tong-quan-nestjs/6/

    return `User ${user.username} has been created`;
  }

  // tuong tu validationPipe
  @UseInterceptors(ClassSerializerInterceptor)
  // nen su dung param userId để query
  @Get('/:username')
  async findUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findUserByUsername(username);

    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      //  cái này k phải badRequest
      // NotFoundException
    return new SerializedUser(user);
  }
}

// em implemenet 1 cai intercepter de thuc hien SerializedUser cho toan bo API
// chi can return user là nó sẽ tự động serialzie data ko cần phải return new SerializedUser(user);
