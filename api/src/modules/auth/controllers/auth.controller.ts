import { Injectable, Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(public readonly authService: AuthService) {}

  /**
   * Endpoint to refresh JWT.
   */
  @Post('/refresh')
  public async refresh(
    @Body() input: { token: string },
  ): Promise<{ jwt: string }> {
    const { token } = input;

    const jwt = await this.authService.refreshToken(token);

    return {
      jwt,
    };
  }
}
