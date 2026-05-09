import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Student])],
    controllers: [StudentController],
    providers: [StudentService],
    exports: [StudentService], // si otros módulos necesitan usar el servicio
})
export class StudentModule {}