import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RequestsController } from './request.controller';
import { RequestsService } from './request.service';
import { Request } from './entity/request.entity';
import { User } from 'src/users/entity/users.entity';
import { Subject } from 'src/subjects/entity/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, User, Subject]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, User, Subject],
  exports: [RequestsService, User, Subject],
})
export class RequestsModule {}