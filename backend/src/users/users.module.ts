import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule, forwardRef(() => AuthModule), forwardRef(()=> WishesModule)],
  controllers: [UsersController],
  providers: [UsersService, JwtService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
