import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public async onModuleInit() {
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}

/**
 * Takes in string. Makes all lowercase, trims whitespace.
 */
export function normalizeString(input: string): string {
  return input.toLowerCase().trim();
}

/**
 * Title cases a string.
 */
export function titleCaseString(input: string): string {
  return input
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
