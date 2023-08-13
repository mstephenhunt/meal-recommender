//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../db/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwtService: JwtService
  ) {}

  /**
   * Returns the JWT of the user with the given username and password.
   */
  public async authenticateUser(input: {
    email: string;
    password: string;
  }): Promise<string> {
    const { email, password } = input;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Error authenticating user');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new Error('Error authenticating user');
    }

    const token = this.jwtService.sign({
      userId: user.id,
    });

    return token;
  }
}