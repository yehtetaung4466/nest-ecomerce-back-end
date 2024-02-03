import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingDto, UpdateRatingDto, updateOpinionDto } from './dto/rating.dto';
import { Request } from 'express';
import { TokenPayload } from 'src/utils/interfaces';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  createNewRating(@Body() dto: RatingDto, @Req() req: Request) {
    const user = req.user as TokenPayload;
    return this.ratingService.makeNewRating(
      dto.rating,
      dto.opinion,
      user.sub,
      dto.itemId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':ratingId')
  updateRating(
    @Req() req: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const user = req.user as TokenPayload;
    return this.ratingService.changeRatingById(ratingId, user.sub, dto.rating);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':ratingId/opinion')
  updateOpinion(
    @Req() req: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: updateOpinionDto,
  ) {
    const user = req.user as TokenPayload;
    return this.ratingService.changeOpinionById(
      ratingId,
      user.sub,
      dto.opinion,
    );
  }
}
