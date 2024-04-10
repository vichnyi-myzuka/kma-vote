import { Module } from '@nestjs/common';
import { AuthController, AuthService } from '@libs/core/auth';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
