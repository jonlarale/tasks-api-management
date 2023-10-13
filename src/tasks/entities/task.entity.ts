// Nestjs
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// Auth
import { User } from '../../auth/entities/user.entity';

// Task
import { TaskStatus } from '../enums';

@Entity({ name: 'tasks' })
export class Task {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'The unique identifier for a task',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Task Title', description: 'The title of the task' })
  @Column({ length: 80 })
  title: string;

  @ApiProperty({
    example: 'This is a description of the task',
    description: 'The description of the task (optional)',
    required: false,
  })
  @Column({ length: 300, nullable: true })
  description: string;

  @ApiProperty({
    example: 'OPEN',
    description: 'The status of the task',
    enum: TaskStatus,
  })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description:
      'The unique identifier of the user to whom the task is assigned',
  })
  @Column({ name: 'user_id' })
  userId: string;
}
