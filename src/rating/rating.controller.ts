import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RationDto } from './dto/rating.dto';
import { Request } from 'express';
import { ITokenPayload } from 'src/utils/interfaces';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  createNewRating(@Body() dto: RationDto, @Req() req: Request) {
    const user = req.user as ITokenPayload;
    return this.ratingService.makeNewRating(
      dto.rating,
      dto.opinion,
      user.sub,
      dto.itemId,
    );
  }
}
