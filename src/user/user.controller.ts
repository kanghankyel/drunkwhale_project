import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  // Create User
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.createUser(createUserDto);
  }

  // Find All User
  @Get()
  findAllUser() {
    return this.userService.findAllUser();
  }

  // Find One User
  @Get(':user_idx')
  findOneUser(@Param('user_idx') user_idx: number) {
    return this.userService.findOneUser(user_idx);
  }

  // Update User
  @Patch(':user_idx')
  updateUser(@Param('user_idx') user_idx: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(user_idx, updateUserDto);
  }

  // Delete User
  @Delete(':user_idx')
  removeUser(@Param('user_idx') user_idx: number) {
    return this.userService.removeUser(user_idx);
  }
}
