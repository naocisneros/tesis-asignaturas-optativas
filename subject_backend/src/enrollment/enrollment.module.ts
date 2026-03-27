import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entity/users.entity';
import { Subject } from 'src/subjects/entity/subject.entity';
import { Enrollment } from './entity/enrollment.entity';
import { EnrollmentsController } from './enrollment.controller';
import { EnrollmentsService } from './enrollment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, User, Subject]),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, User, Subject],
  exports: [EnrollmentsService, User, Subject],
})
export class EnrollmentModule {}