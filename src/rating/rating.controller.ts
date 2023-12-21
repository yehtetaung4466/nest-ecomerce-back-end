import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingDto, UpdateRatingDto } from './dto/rating.dto';
import { Request } from 'express';
import { ITokenPayload } from 'src/utils/interfaces';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  createNewRating(@Body() dto: RatingDto, @Req() req: Request) {
    const user = req.user as ITokenPayload;
    return this.ratingService.makeNewRating(
      dto.rating,
      dto.opinion,
      user.sub,
      dto.itemId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put(':ratingId')
  updateRating(
    @Req() req: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const user = req.user as ITokenPayload;
    return this.ratingService.changeRatingById(
      ratingId,
      user.sub,
      dto.rating,
      dto.opinion,
    );
  }
}
