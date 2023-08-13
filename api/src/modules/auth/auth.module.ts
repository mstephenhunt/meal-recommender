import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// TODO: Env var this
export const jwtSecret = 'zjP9h6ZI5LoSKCRj';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      // TODO: Env var this
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
