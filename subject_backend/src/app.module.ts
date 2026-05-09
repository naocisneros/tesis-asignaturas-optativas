import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.guard';
import { SubjectModule } from './subjects/subject.module';
import { RequestsModule } from './requests/request.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { TeacherModule } from './teachers/teacher.module';
import { ContentDistributionModule } from './content-distribution/content-distribution.module';
import { StudentModule } from './students/student.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'assets'),
      serveRoot: '/assets', // URL base
    }),
    ConfigModule.forRoot(), // Para usar variables de entorno
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'mi_app_db', // ← Base de datos específica
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: process.env.RUN_MIGRATIONS === 'true',
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    SubjectModule,
    RequestsModule,
    EnrollmentModule,
    TeacherModule,
    ContentDistributionModule,
    StudentModule
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtAuthGuard,
  //   },
  // ],
})
export class AppModule {}
