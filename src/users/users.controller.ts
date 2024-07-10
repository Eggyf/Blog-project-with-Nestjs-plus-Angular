import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { catchError, from, Observable, map, of } from 'rxjs';
import { User } from './entities/user.entity';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';


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
  @hasRoles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Observable<Pagination<CreateUserDto>> {
    limit = limit > 100 ? 100 : limit;
    return from(this.usersService.paginate({ page: Number(page), limit: Number(limit), route: 'https://localhost:3000/users' }));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<CreateUserDto> {
    return from(this.usersService.findOne(id));
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Observable<any> {
    return from(this.usersService.update(id, updateUserDto));
  }

  @Put(':id/role')
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto): Observable<any> {
    return this.usersService.updateUserRole(id, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return from(this.usersService.removeOne(id));
  }
}
