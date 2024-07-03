import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { catchError, from, Observable, map, of } from 'rxjs';
import { User } from './entities/user.entity';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<User | Object> {
    return from(this.usersService.create(createUserDto)).pipe(
      map((user: CreateUserDto) => user),
      catchError(err => of({ error: err.message }))
    );
  }
  @Post('login')
  login(@Body() user: CreateUserDto): Observable<Object> {
    return this.usersService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt }
      })
    )
  }
  @Get()
  findAll(): Observable<CreateUserDto[]> {
    return from(this.usersService.findAll());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<CreateUserDto> {
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
