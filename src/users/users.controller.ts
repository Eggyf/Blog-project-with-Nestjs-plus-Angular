import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { from, Observable } from 'rxjs';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<User> {
    return from(this.usersService.create(createUserDto));
  }

  @Get()
  findAll(): Observable<User[]> {
    return from(this.usersService.findAll());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<User> {
    return from(this.usersService.findOne(id));
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Observable<any> {
    return from(this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return from(this.usersService.removeOne(id));
  }
}
