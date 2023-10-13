import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Limit the number of items to retrieve (optional)',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Offset for paginated results (optional)',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
