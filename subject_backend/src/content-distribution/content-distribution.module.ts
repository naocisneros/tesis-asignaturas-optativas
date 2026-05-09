
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentDistributionService } from './content-distribution.service';
import { ContentDistributionController } from './content-distribution.controller';
import { ContentDistribution } from './entity/content-distribution.entity';
import { Subject } from 'src/subjects/entity/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentDistribution, Subject])],
  controllers: [ContentDistributionController],
  providers: [ContentDistributionService],
  exports: [ContentDistributionService]
})
export class ContentDistributionModule {}