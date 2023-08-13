import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service';

type User = {
  email: string;
  jwt?: string;
};

@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService) {}

  public async logIn(input: {
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const jwt = await this.authService.authenticateUser(input);

      return {
        email: input.email,
        jwt,
      };
    } catch (error) {
      throw new Error('Failed to log in user');
    }
  }
}
