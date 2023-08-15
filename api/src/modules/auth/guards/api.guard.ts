import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class APIGuard implements CanActivate {
  private readonly apiKeys: string[];

  constructor(private configService: ConfigService) {
    this.apiKeys = this.configService.get<string[]>('API_ACCESS_TOKENS');
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const apiKeyHeader = req.headers['api-key'];

      if (this.apiKeys.includes(apiKeyHeader)) {
        return true;
      }

      throw new Error('Invalid API key');
    } catch (error) {
      console.error({
        msg: `Unable to authenticate request`,
        err: error,
      });

      return false;
    }
  }
}
