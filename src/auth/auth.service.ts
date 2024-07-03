import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Observable, of } from 'rxjs';
import { from } from 'rxjs';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) { }

  generateJWT(user: CreateUserDto): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePasswords(newPassword: string, hashPassword: string): Observable<any | boolean> {
    return of<any | boolean>(bcrypt.compare(newPassword, hashPassword));
  }


}
