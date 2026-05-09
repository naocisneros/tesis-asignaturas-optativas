import { Controller, Get, UsePipes, Query, ValidationPipe, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from "@nestjs/common";
import { SubjectService } from "./subject.service";
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { CreateSubjectDto, FilterSubjectDto, UpdateSubjectDto } from "./dto";
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

   @Patch(':id')
   @ApiOperation({ summary: 'Actualizar una asignatura existente' })
   @ApiParam({ name: 'id', description: 'ID de la asignatura', type: String })
   @ApiBody({ type: UpdateSubjectDto })
   @ApiOkResponse({ description: 'Asignatura actualizada correctamente', type: Subject })
   @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
   @UsePipes(new ValidationPipe({
     whitelist: true,
     transform: true,
   }))
   async updateSubject(
     @Param('id', ParseUUIDPipe) id: string,
     @Body() updateSubjectDto: UpdateSubjectDto
   ) {
     const subject = await this.subjectService.update(id, updateSubjectDto);
     return {
       message: 'Asignatura actualizada correctamente',
       data: subject
     };
   }

   @Delete(':id')
   @ApiOperation({ summary: 'Eliminar una asignatura del sistema' })
   @ApiParam({ name: 'id', description: 'ID de la asignatura', type: String })
   @ApiOkResponse({ description: 'Asignatura eliminada correctamente' })
   @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
   @HttpCode(HttpStatus.OK)
   async deleteSubject(
     @Param('id', ParseUUIDPipe) id: string
   ) {
     await this.subjectService.deleteRequest(id);
     return {
       message: 'Asignatura eliminada correctamente',
       data: null
     };
   }
}