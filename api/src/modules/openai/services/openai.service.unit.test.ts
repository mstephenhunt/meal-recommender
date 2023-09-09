import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import { RequestCacheService } from '../../utils/services/request-cache.service';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../db/services/prisma.service';

jest.mock('rxjs', () => {
  const original = jest.requireActual('rxjs');

  return {
    ...original,
    lastValueFrom: (providedValue) =>
      new Promise((resolve) => {
        resolve(providedValue);
      }),
  };
});

describe('OpenaiService', () => {
  let openaiService: OpenaiService;
  let requestCacheService: RequestCacheService;

  // This needs to be defined outside of an individual test in order for it to resolve correctly
  // I think the value is being copied into the instance and referencing this variable doesn't
  // change the value in mocks inside of tests.
  const mockMeal = {
    name: 'meal name',
    ingredients: [
      {
        name: 'flour',
        quantity: 0.5,
        unit: 'cup',
      },
    ],
    instructions: 'instructions',
  };

  const mockResponse = {
    data: {
      choices: [
        {
          message: {
            content: JSON.stringify({ ...mockMeal }),
          },
        },
      ],
    },
  };
  const mockPostFunction: jest.Mock = jest
    .fn()
    .mockReturnValueOnce(mockResponse as AxiosResponse);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule.forRoot()],
      providers: [
        OpenaiService,
        {
          provide: HttpService,
          useValue: {
            post: mockPostFunction,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key'),
          },
        },
        RequestCacheService,
        PrismaService,
      ],
    }).compile();

    openaiService = module.get<OpenaiService>(OpenaiService);
    requestCacheService = module.get<RequestCacheService>(RequestCacheService);
  });

  it('should be defined', () => {
    expect(openaiService).toBeDefined();
  });

  it('should call sendMessage and return a response', async () => {
    jest
      .spyOn(requestCacheService, 'cacheAxiosRequestResponse')
      .mockImplementation(() => Promise.resolve());

    const input = {
      recipeName: 'Test Recipe',
      ingredients: ['ingredient1', 'ingredient2'],
      allergens: ['allergen1'],
      diets: ['diet1', 'diet2'],
    };

    const response = await openaiService.requestRecipeWithFilters(input);

    // Verify that sendMessage was called with the expected message content
    expect(mockPostFunction).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: expect.stringContaining(
              `Please provide a recipe for Test Recipe. The recipe should use some or all of these ingredients: ingredient1, ingredient2. The recipe should not contain these allergens: allergen1. The recipe should fit these diets: diet1, diet2.`,
            ),
          },
        ],
      },
      {
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
      },
    );

    // Verify that cacheAxiosRequestResponse was called
    expect(requestCacheService.cacheAxiosRequestResponse).toHaveBeenCalled();

    // Verify that the response is as expected
    expect(response).toEqual({
      name: 'meal name',
      ingredients: [
        {
          name: 'flour',
          quantity: 0.5,
          unit: 'cup',
        },
      ],
      instructions: 'instructions',
    });
  });
});
