import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service';
import { PrismaService } from '../../db/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as Joi from 'joi';
import { UserContextService } from './user-context.service';

type User = {
  email: string;
  jwt?: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly userContextService: UserContextService,
  ) {}

  public async logIn(input: {
    email: string;
    password: string;
  }): Promise<User> {
    // Does this user exist?
    const user = await this.prismaService.user.findUnique({
      where: {
        email: input.email.toLowerCase(),
      },
    });

    if (!user) {
      console.error("User doesn't exist");
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
    signupCode: string;
  }): Promise<User> {
    const userSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      signupCode: Joi.string().required(),
    });

    const { error } = userSchema.validate(input);

    if (error) {
      this.logger.error('Invalid user input', {
        error,
      });

      throw new Error('Invalid user input');
    }

    const signupCode = this.configService
      .get<string>('SIGNUP_CODE')
      .toLowerCase();

    if (input.signupCode.toLowerCase() !== signupCode) {
      this.logger.error('Invalid signup code', {
        signupCode,
      });

      throw new Error('Invalid signup code');
    }

    const hashedPass = await this.authService.hashPassword(input.password);

    const user = await this.prismaService.user.create({
      data: {
        email: input.email.toLowerCase(),
        password: hashedPass,
      },
    });

    return {
      email: input.email,
      jwt: this.authService.getJwt(user.id),
    };
  }

  public async associateRecipe(input: { recipeId: number }): Promise<void> {
    // Associate this recipe to the current user
    const { recipeId } = input;

    const userId = await this.userContextService.userId;

    this.logger.log('Associating recipe to user', {
      userId,
      recipeId,
    });

    await this.prismaService.userRecipe.create({
      data: {
        userId,
        recipeId,
      },
    });
  }
}
