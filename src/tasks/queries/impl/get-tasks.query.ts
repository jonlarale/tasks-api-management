import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class GetTasksQuery {
  constructor(
    public readonly paginationDto: PaginationDto,
    public readonly userId: string,
  ) {}
}
