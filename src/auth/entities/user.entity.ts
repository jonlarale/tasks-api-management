// Nestjs
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

// Task
import { Task } from '../../tasks/entities/task.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'The unique identifier for a user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @Column('text')
  name: string;

  @ApiProperty({ example: 'Doe', description: 'The first surname of the user' })
  @Column('text', { name: 'first_surname' })
  firstSurname: string;

  @ApiProperty({
    example: 'Smith',
    description: 'The last surname of the user (optional)',
    required: false,
  })
  @Column('text', { name: 'last_surname', nullable: true })
  lastSurname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    example: '2023-10-10T08:07:59.120Z',
    description: 'The date and time when the user was created',
  })
  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-10T08:07:59.120Z',
    description: 'The date and time when the user was last updated',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    example: true,
    description: 'Whether the user is activated or not',
  })
  @Column('bool', { default: true })
  activated: boolean;

  @ApiProperty({
    example: '2023-10-10T08:07:59.120Z',
    description: 'The date and time when the user was activated (optional)',
    required: false,
  })
  @Column({ name: 'activated_at', nullable: true })
  activatedAt: Date;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user (will not be included in responses)',
    writeOnly: true,
  })
  @Exclude()
  @Column('text', { nullable: true, select: false })
  password?: string;

  @ApiProperty({
    example: ['user'],
    description: 'The roles assigned to the user',
  })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Task, (task) => task.user, {
    eager: false,
    cascade: true,
  })
  tasks: Task[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
