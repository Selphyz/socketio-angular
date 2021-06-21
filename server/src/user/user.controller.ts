import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CreateUserDto, LoginUserDto } from './model/user.dto';
import { IUser } from './model/user.interface';
import { UserHelperService } from './service/user-helper.service';
import { UserService } from './service/user.service';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private userHelperService: UserHelperService) { }
    @Post('register')
    create(@Body() createUserDto: CreateUserDto): Observable<IUser>{
        return this.userHelperService.createUserDtoToEntity(createUserDto).pipe(
            switchMap((user: IUser)=> this.userService.create(user))
        )
    }
    @Post('login')
    login(@Body() loginUserDto: LoginUserDto): Observable<boolean>{
        return this.userHelperService.loginUserDtoToEntity(loginUserDto).pipe(
            switchMap((user: IUser)=> this.userService.login(user))
        )
    }
    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Observable<Pagination<IUser>>{
        limit = limit > 100 ? 100: limit;
        return this.userService.findAll({page, limit, route: 'http://localhost:3000/api/users'});
    }
}
