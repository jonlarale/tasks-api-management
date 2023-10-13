import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Error Message' })
  message: string;

  @ApiProperty({ description: 'Error type' })
  error: string;

  @ApiProperty({ description: 'HTTP Code Status' })
  statusCode: number;
}
