import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpertDto } from './dto/create-expert.dto';

@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService) {}

  async create(createExpertDto: CreateExpertDto) {
    return this.prisma.expert.create({
      data: {
        ...createExpertDto,
        hourlyRate: createExpertDto.hourlyRate.toString(),
      },
    });
  }

  async findAll() {
    return this.prisma.expert.findMany();
  }

  async findOne(id: string) {
    return this.prisma.expert.findUnique({
      where: { id },
    });
  }
}
