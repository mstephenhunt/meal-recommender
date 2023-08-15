import { ConfigService } from '@nestjs/config';
import NodeEnvironment from 'jest-environment-node';

class PrismaTestEnvironment extends NodeEnvironment {
  prismaDBUrl: string;

  constructor(config, context) {
    super(config, context);

    this.prismaDBUrl = new ConfigService().get<string>('DATABASE_URL');

    if (!this.prismaDBUrl) {
      throw Error('DATABASE_URL_WITH_SCHEMA environment variable is not set');
    }
  }

  public async setup() {
    process.env.DATABASE_URL_WITH_SCHEMA = this.prismaDBUrl;

    return super.setup();
  }
}

export default PrismaTestEnvironment;
