import { Test, TestingModule } from '@nestjs/testing';
import { ExpertService } from './expert.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ExpertService', () => {
  let service: ExpertService;
  let prisma: PrismaService;

  const mockPrismaService = {
    expert: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpertService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ExpertService>(ExpertService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an expert', async () => {
      const expertData = {
        name: 'John Doe',
        email: 'john@example.com',
        specialization: 'Finance',
        hourlyRate: 100,
      };

      const expectedExpert = {
        id: '1',
        ...expertData,
        hourlyRate: '100',
        rating: 0,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.expert.create.mockResolvedValue(expectedExpert);

      const result = await service.create(expertData);
      expect(result).toEqual(expectedExpert);
      expect(prisma.expert.create).toHaveBeenCalledWith({
        data: {
          ...expertData,
          hourlyRate: expertData.hourlyRate.toString(),
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all experts', async () => {
      const expectedExperts = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          specialization: 'Finance',
          hourlyRate: '100',
          rating: 0,
          availability: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.expert.findMany.mockResolvedValue(expectedExperts);

      const result = await service.findAll();
      expect(result).toEqual(expectedExperts);
      expect(prisma.expert.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single expert', async () => {
      const expectedExpert = {
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

      mockPrismaService.expert.findUnique.mockResolvedValue(expectedExpert);

      const result = await service.findOne('1');
      expect(result).toEqual(expectedExpert);
      expect(prisma.expert.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
