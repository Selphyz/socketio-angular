import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { UserController } from './user.controller';
import { UserService } from './service/user.service';
import { UserHelperService } from './service/user-helper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService]
})
export class UserModule {}
