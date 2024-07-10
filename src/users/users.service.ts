import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs'
import { AuthService } from 'src/auth/auth.service';
import { match } from 'assert';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>, private authService: AuthService) { }
  create(user: CreateUserDto): Observable<CreateUserDto> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashPassword: string) => {
        const newUser = new CreateUserDto();

        newUser.email = user.email;
        newUser.name = user.name;
        newUser.password = hashPassword;
        newUser.username = user.username;
        newUser.role = user.role;

        return from(this.userRepo.save(newUser)).pipe(
          map((user: CreateUserDto) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError(err => throwError(err))
        )
      }
      )
    )// return from(this.userRepo.save(user));
  }

  findAll(): Observable<CreateUserDto[]> {
    return from(this.userRepo.find()).pipe(
      map((users: CreateUserDto[]) => {
        users.forEach((v) => { delete v.password });
        return users
      })
    );
  }

  findOne(id: number): Observable<CreateUserDto> {
    return from(this.userRepo.findOne({ where: { id: id } })).pipe(
      map((user: CreateUserDto) => {
        const { password, ...result } = user;
        return result;
      })
    );
  }

  update(id: number, user: UpdateUserDto): Observable<any> {
    delete user.email;
    delete user.password;
    return from(this.userRepo.update(id, user));
  }

  updateUserRole(id: number, user: UpdateUserDto): Observable<any> {
    return from(this.userRepo.update(id, user))
  }

  removeOne(id: number): Observable<any> {
    return from(this.userRepo.delete(id));
  }

  login(user: CreateUserDto): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: CreateUserDto) => {
        if (user) {
          return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
        }
        else {
          return "Wrong Credentials";
        }
      })
    );
  }
  validateUser(email: string, password: string): Observable<CreateUserDto> {
    return this.findByMail(email).pipe(
      switchMap((user: CreateUserDto) => this.authService.comparePasswords(password, user.password).pipe(
        map((match: boolean) => {
          if (match) {
            const { password, ...result } = user;
            return result;
          }
          else {
            throw Error;
          }
        })
      ))
    )
  }
  findByMail(email: string): Observable<CreateUserDto> {
    return from(this.userRepo.findOne({ where: { email: email } }));
  }

}
