import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UserContextService {
  constructor(@Inject(REQUEST) private request: Request) {}

  public get userId(): number {
    if (this.request['user'] === undefined) {
      return 0;
    }

    const user = this.request.user as any;

    return user.userId;
  }
}
