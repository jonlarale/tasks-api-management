import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class GetUsersQuery {
  constructor(public readonly paginationDto: PaginationDto) {}
}
