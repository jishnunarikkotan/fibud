import { Controller, Get, Post, Body, Param, ValidationPipe } from '@nestjs/common';
import { ExpertService } from './expert.service';
import { CreateExpertDto } from './dto/create-expert.dto';

@Controller('experts')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Post()
  create(@Body(ValidationPipe) createExpertDto: CreateExpertDto) {
    return this.expertService.create(createExpertDto);
  }

  @Get()
  findAll() {
    return this.expertService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expertService.findOne(id);
  }
}
