import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { map } from "rxjs";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,

        @Inject(forwardRef(() => UsersService))
        private userService: UsersService
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        console.log(request);
        const user: CreateUserDto = request.user;

        return this.userService.findOne(user.id).pipe(
            map((user: CreateUserDto) => {
                const hasRole = () => roles.indexOf(user.role) > -1;

                let hasPermission: boolean = false;
                if (hasRole) { hasPermission = true; }
                return user && hasPermission;
            })
        )


    }
}