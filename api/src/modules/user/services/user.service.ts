import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service';
import { PrismaService } from '../../db/services/prisma.service';

type User = {
  email: string;
  jwt?: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  public async logIn(input: {
    email: string;
    password: string;
  }): Promise<User> {
    // Does this user exist?
    const user = await this.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      console.error('User doesn\'t exist');
      throw new Error('Failed to log in user');
    }

    try {
      const jwt = await this.authService.authenticateUser({
        userId: user.id,
        passwordHash: user.password,
        password: input.password,
      });

      return {
        email: input.email,
        jwt,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to log in user');
    }
  }

  public async createUser(input: {
    email: string;
    password: string;
  }): Promise<User> {
    const hashedPass = await this.authService.hashPassword(input.password);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPass,
      },
    });

    return {
      email: input.email,
      jwt: this.authService.getJwt(user.id)
    }
  }
}
