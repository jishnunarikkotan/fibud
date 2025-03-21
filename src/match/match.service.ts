import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto) {
    const expert = await this.prisma.expert.findUnique({
      where: { id: createMatchDto.expertId },
    });

    if (!expert) {
      throw new NotFoundException(`Expert with ID ${createMatchDto.expertId} not found`);
    }

    const client = await this.prisma.client.findUnique({
      where: { id: createMatchDto.clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${createMatchDto.clientId} not found`);
    }

    return this.prisma.expertMatch.create({
      data: {
        expertId: createMatchDto.expertId,
        clientId: createMatchDto.clientId,
        notes: createMatchDto.notes,
      },
      include: {
        expert: true,
        client: true,
      },
    });
  }

  async findAll(specialization?: string, minRating?: string) {
    const minRatingNumber = minRating ? parseFloat(minRating) : undefined;
    
    return this.prisma.expertMatch.findMany({
      where: {
        expert: {
          ...(specialization ? { specialization } : {}),
          ...(minRatingNumber !== undefined ? { rating: { gte: minRatingNumber } } : {}),
        },
      },
      include: {
        expert: true,
        client: true,
      },
    });
  }
}
