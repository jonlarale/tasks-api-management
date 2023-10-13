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
import { Task } from '../../tasks/entities/task.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', { name: 'first_surname' })
  firstSurname: string;

  @Column('text', { name: 'last_surname', nullable: true })
  lastSurname: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('bool', {
    default: true,
  })
  activated: boolean;

  @Column({
    name: 'activated_at',
    nullable: true,
  })
  activatedAt: Date;

  @Exclude()
  @Column('text', {
    nullable: true,
    select: false,
  })
  password?: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
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
