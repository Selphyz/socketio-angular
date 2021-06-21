import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { UserEntity } from '../model/user.entity';
import { IUser } from '../model/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ){}
    create(newUser: IUser): Observable<IUser>{
        return this.mailExists(newUser.email).pipe(
            switchMap((exists:boolean)=>{
                if(!exists){
                    return this.hashPassword(newUser.password).pipe(
                        switchMap((passwordHash: string)=>{
                            newUser.password = passwordHash;
                            return from(this.userRepository.save(newUser)).pipe(
                                switchMap((user: IUser)=> this.findOne(user.id))
                            )
                        })
                    );
                }else{
                    throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
                }                
            })
        )
    }
    login(user: IUser): Observable<boolean>{
        return this.findByEmail(user.email).pipe(
            switchMap((foundUser: IUser)=>{
                if(foundUser){
                    return this.validatePassword(user.password, foundUser.password).pipe(
                        switchMap((matches: boolean)=>{
                            if(matches){
                                return this.findOne(foundUser.id).pipe(mapTo(true))
                            }else{
                                throw new HttpException('Login unsuccessful, wrong credentials', HttpStatus.UNAUTHORIZED)
                            }
                        })
                    )
                }else{
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND)
                }
            })
        )
    }
    findAll(options: IPaginationOptions): Observable<Pagination<IUser>>{
        return from(paginate<UserEntity>(this.userRepository, options));
    }
    private validatePassword(password: string, hashedPassword: string): Observable<any>{
        return from(bcrypt.compare(password, hashedPassword))
    }
    private findByEmail(email: string): Observable<IUser>{
        return from(this.userRepository.findOne({email}, {select: ['id','email','username','password']}))
    }
    private findOne(id: number): Observable<IUser>{
        return from(this.userRepository.findOne({id}))
    }
    private hashPassword(password: string): Observable<string>{
        return from<string>(bcrypt.hash(password, 12))
    }
    private mailExists(email: string): Observable<boolean> {
        return from(this.userRepository.findOne({ email })).pipe(
          map((user: IUser) => {
            return(user) ? true : false;
          })
        )
    }
}
