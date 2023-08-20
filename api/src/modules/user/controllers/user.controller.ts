import { Injectable, Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Injectable()
@Controller('api/user')
export class UserController {
  constructor(public readonly userService: UserService) {}

  /**
   * Post endpoint to create user. Takes in email and password.
   */
  @Post()
  public async createUser(
    @Body() input: { email: string; password: string },
  ): Promise<{ email: string; jwt: string }> {
    const user = await this.userService.createUser(input);

    return {
      email: user.email,
      jwt: user.jwt,
    };
  }

  /**
   * Post endpoint to log in user. Takes in email and password.
   */
  @Post('/login')
  public async logIn(
    @Body() input: { email: string; password: string },
  ): Promise<{ email: string; jwt: string }> {
    const user = await this.userService.logIn(input);

    return {
      email: user.email,
      jwt: user.jwt,
    };
  }
}
