import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'fa04bb06-9aa3-4868-b892-2ada9f5f7fe4',
    description: 'The unique identifier of the logged-in user',
  })
  id: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMDRiYjA2LTlhYTMtNDg2OC1iODkyLTJhZGE5ZjVmN2ZlNCIsImlhdCI6MTY5NzE2NTg0MiwiZXhwIjoxNjk3MjUyMjQyfQ.gs5AMoza4eMxcltwCTACoGqTK9T2E7d9mjEOcsh3XJY',
    description: 'The JWT token for the session',
  })
  token: string;
}
