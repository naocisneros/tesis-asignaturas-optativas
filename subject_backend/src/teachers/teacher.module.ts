import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher } from './entity/teacher.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Teacher]) // Registra la entidad para inyección del repositorio
    ],
    controllers: [TeacherController],
    providers: [TeacherService],
    exports: [TeacherService] // Exporta el servicio para usarlo en otros módulos
})
export class TeacherModule {}