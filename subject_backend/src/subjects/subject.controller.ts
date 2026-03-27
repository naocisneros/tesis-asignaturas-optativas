import { Controller, Get, UsePipes, Query, ValidationPipe, Post, Body } from "@nestjs/common";
import { SubjectService } from "./subject.service";
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateSubjectDto, FilterSubjectDto } from "./dto";
import { Subject } from "typeorm/persistence/Subject";

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
   constructor(private readonly subjectService: SubjectService){}

   @Get()
   @ApiOperation({ summary: 'Listar todas las asignaturas optativas'})
   @ApiResponse({ status: 200, description: 'Listar todas las asignaturas optativas', type: [Subject]})
   @UsePipes(new ValidationPipe({
     whitelist: true,
     transform: true,
   }),)
   async findAll(@Query() filterDto: FilterSubjectDto){
       return this.subjectService.findAll(filterDto);
   }

   @Post()
   @ApiOperation({ summary: 'Registrar nueva asignatura en el sistema'})
   @ApiBody({ type: CreateSubjectDto})
   @ApiOkResponse({ description: 'Asignatura registrada correctamente'})
   async createSubject(@Body() createSubjectDto: CreateSubjectDto){
        const subject = await this.subjectService.create(createSubjectDto);
        return subject;
   }
}