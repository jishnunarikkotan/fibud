import { Controller, Get, Post, Body, Query, ValidationPipe } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  create(@Body(ValidationPipe) createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  findAll(
    @Query('specialization') specialization?: string,
    @Query('minRating') minRating?: number,
  ) {
    return this.matchService.findAll(specialization, minRating);
  }
}
