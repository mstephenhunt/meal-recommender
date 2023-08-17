import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Returns the JWT of the user with the given username and password.
   */
  public async authenticateUser(input: {
    userId: number;
    passwordHash: string;
    password: string;
  }): Promise<string> {
    const { userId, passwordHash, password } = input;

    const passwordValid = await bcrypt.compare(password, passwordHash);

    if (!passwordValid) {
      throw new Error('Error authenticating user');
    }

    return this.getJwt(userId);
  }

  /**
   * Returns the hash of the provided password.
   */
  public async hashPassword(password: string): Promise<string> {
    // @TODO: Env var this
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  public getJwt(userId: number): string {
    const token = this.jwtService.sign({
      userId,
    });

    return token;
  }

  public async refreshToken(token: string): Promise<string> {
    const { userId } = this.jwtService.verify(token);

    return this.getJwt(userId);
  }
}
