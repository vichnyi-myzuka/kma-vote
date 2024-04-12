import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CookieSerializer } from '@libs/core/auth/utils';
import { Admin, BaseStudent, User } from '@libs/core/database';
import { AuthController, AuthService } from '@libs/core/auth/module';
import * as strategies from '@libs/core/auth/strategies';

@Module({
  imports: [TypeOrmModule.forFeature([BaseStudent, User, Admin], 'main')],
  providers: [AuthService, ...Object.values(strategies), CookieSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
