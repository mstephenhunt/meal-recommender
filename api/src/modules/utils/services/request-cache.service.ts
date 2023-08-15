import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/services/prisma.service';
import { AxiosResponse } from 'axios';

type RequestInput = {
  url: string;
  method: string;
  body?: object;
  headers?: object;
};

type ResponseInput = {
  status: number;
  body?: object;
  headers?: object;
};

type RequestCache = {
  id: number;
  url: string;
  method: string;
  body?: object;
  headers?: object;
};

type ResponseCache = {
  id: number;
  status: number;
  body?: object;
  headers?: object;
};

@Injectable()
export class RequestCacheService {
  constructor(private readonly prismaService: PrismaService) {}

  public async cacheAxiosRequestResponse(
    axiosResponse: AxiosResponse,
  ): Promise<void> {
    // If this request contains an Authorization header, change the value to 'REDACTED'
    const requestHeaders = axiosResponse.config.headers;
    if (axiosResponse.config.headers.Authorization) {
      requestHeaders.Authorization = 'REDACTED';
    }

    const requestInput: RequestInput = {
      url: axiosResponse.config.url,
      method: axiosResponse.config.method,
      body: axiosResponse.config.data
        ? JSON.parse(axiosResponse.config.data)
        : undefined,
      headers: requestHeaders,
    };

    const requestCache = await this.cacheRequest(requestInput);

    const responseInput: ResponseInput = {
      status: axiosResponse.status,
      body: axiosResponse.data,
      headers: axiosResponse.headers,
    };

    const responseCache = await this.cacheResponse(responseInput);

    await this.associateRequestAndResponse({
      requestId: requestCache.id,
      responseId: responseCache.id,
    });
  }

  public async cacheRequest(requestInput: RequestInput): Promise<RequestCache> {
    const saved = await this.prismaService.requestCache.create({
      data: {
        url: requestInput.url,
        method: requestInput.method,
        body: requestInput.body,
        headers: requestInput.headers,
      },
    });

    return {
      id: saved.id,
      ...requestInput,
    };
  }

  private async cacheResponse(
    responseInput: ResponseInput,
  ): Promise<ResponseCache> {
    const saved = await this.prismaService.responseCache.create({
      data: {
        statusCode: responseInput.status,
        body: responseInput.body,
        headers: responseInput.headers,
      },
    });

    return {
      id: saved.id,
      ...responseInput,
    };
  }

  private async associateRequestAndResponse(input: {
    requestId: number;
    responseId: number;
  }): Promise<void> {
    await this.prismaService.requestResponseCache.create({
      data: {
        requestId: input.requestId,
        responseId: input.responseId,
      },
    });
  }
}
