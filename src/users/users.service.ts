import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs'
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }
  create(user: CreateUserDto): Observable<User> {
    return from(this.userRepo.save(user));
  }

  findAll(): Observable<User[]> {
    return from(this.userRepo.find());
  }

  findOne(id: number): Observable<User> {
    return from(this.userRepo.findOne({ where: { id: id } }));
  }

  update(id: number, user: UpdateUserDto): Observable<any> {
    return from(this.userRepo.update(id, user));
  }

  removeOne(id: number): Observable<any> {
    return from(this.userRepo.delete(id));
  }
}
