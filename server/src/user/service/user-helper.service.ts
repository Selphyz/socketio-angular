import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDto, LoginUserDto } from '../model/user.dto';
import { IUser } from '../model/user.interface';

@Injectable()
export class UserHelperService {
    createUserDtoToEntity(createUserDto: CreateUserDto): Observable<IUser>{
        return of({
            email: createUserDto.email,
            username: createUserDto.username,
            password: createUserDto.password
        });
    }
    loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<IUser>{
        return of({
            email: loginUserDto.email,
            password: loginUserDto.password
        });
    }
}
