import { PrismaClient } from '@prisma/client';
import { sqltag } from '@prisma/client/runtime/library';
import { execSync } from 'child_process';
import { ConfigService } from '@nestjs/config';

async function setup() {
  console.log('Running test setup...');

  const prismaDBUrl = new ConfigService().get<string>('TEST_DATABASE_URL');
  process.env.DATABASE_URL = prismaDBUrl;

  const client = new PrismaClient();
  await client.$connect();

  const prismaSchema = new ConfigService().get<string>('TEST_DATABASE_SCHEMA');

  const existingPrismaSchema = (await client.$queryRaw(
    sqltag([
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${prismaSchema}';`,
    ]),
  )) as string[];

  if (existingPrismaSchema.length === 0) {
    console.log(`Missing schema [${prismaSchema}], creating...`);
    execSync('yarn prisma migrate deploy');
  }

  await client.$disconnect();

  console.log('Done with global test setup!');
}

export default setup;
