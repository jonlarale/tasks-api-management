import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    //Congif module
    ConfigModule.forRoot({
      load: [AppConfig],
      validationSchema: JoiValidationSchema,
    }),

    // Postgres module
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    // Modules
    TasksModule,
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
