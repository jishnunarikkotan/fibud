import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('MatchService', () => {
  let service: MatchService;
  let prisma: PrismaService;

  const mockPrismaService = {
    expert: {
      findUnique: jest.fn(),
    },
    client: {
      findUnique: jest.fn(),
    },
    expertMatch: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockExpert = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      specialization: 'Finance',
      hourlyRate: '100',
      rating: 0,
      availability: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockClient = {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a match when expert and client exist', async () => {
      const matchData = {
        expertId: '1',
        clientId: '2',
        notes: 'Test match',
      };

      mockPrismaService.expert.findUnique.mockResolvedValue(mockExpert);
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const expectedMatch = {
        id: '1',
        ...matchData,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        matchRating: null,
        expert: mockExpert,
        client: mockClient,
      };

      mockPrismaService.expertMatch.create.mockResolvedValue(expectedMatch);

      const result = await service.create(matchData);
      expect(result).toEqual(expectedMatch);
    });

    it('should throw NotFoundException when expert does not exist', async () => {
      const matchData = {
        expertId: '1',
        clientId: '2',
        notes: 'Test match',
      };

      mockPrismaService.expert.findUnique.mockResolvedValue(null);

      await expect(service.create(matchData)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when client does not exist', async () => {
      const matchData = {
        expertId: '1',
        clientId: '2',
        notes: 'Test match',
      };

      mockPrismaService.expert.findUnique.mockResolvedValue(mockExpert);
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.create(matchData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return filtered matches', async () => {
      const mockMatches = [
        {
          id: '1',
          expertId: '1',
          clientId: '2',
          status: 'PENDING',
          notes: 'Test match',
          createdAt: new Date(),
          updatedAt: new Date(),
          matchRating: null,
          expert: {
            id: '1',
            specialization: 'Finance',
            rating: 4.5,
          },
          client: {
            id: '2',
          },
        },
      ];

      mockPrismaService.expertMatch.findMany.mockResolvedValue(mockMatches);

      const result = await service.findAll('Finance', '4.0');
      expect(result).toEqual(mockMatches);
      expect(prisma.expertMatch.findMany).toHaveBeenCalledWith({
        where: {
          expert: {
            specialization: 'Finance',
            rating: { gte: 4.0 },
          },
        },
        include: {
          expert: true,
          client: true,
        },
      });
    });
  });
});
