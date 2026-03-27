import { Controller, Post, Get, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { RequestsService } from "./request.service";
import { CreateRequestDto } from "./dto/create-request.dto";
import { CreateBulkRequestsDto } from "./dto";
import { UpdateRequestDto } from "./dto/update-request.dto";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { User } from "src/users/entity/users.entity";
import { Request } from "./entity/request.entity";
import { Request as ExpressRequest } from "express";

@ApiTags('solicitudes')
@Controller('requests')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva solicitud' })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente', type: Request })
  @ApiResponse({ status: 404, description: 'Usuario o asignatura no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos de solicitud inválidos' })
  async createRequest(
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: ExpressRequest
  ) {
    const user = req.user as User;
    return await this.requestsService.createRequest(createRequestDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear múltiples solicitudes simultáneamente' })
  @ApiResponse({ status: 201, description: 'Solicitudes creadas exitosamente', type: [Request] })
  @ApiResponse({ status: 400, description: 'Número máximo de solicitudes excedido (14)' })
  @ApiResponse({ status: 404, description: 'Usuario o asignatura no encontrado' })
  async createBulkRequests(
    @Body() createBulkRequestsDto: CreateBulkRequestsDto,
    @Req() req: ExpressRequest
  ) {
    const user = req.user as User;
    return await this.requestsService.createBulkRequests(createBulkRequestsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las solicitudes' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes', type: [Request] })
  async getAllRequests() {
    return await this.requestsService.getAllRequests();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud por ID' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada', type: Request })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async getRequest(@Param('id') id: string) {
    return await this.requestsService.getRequestWithDetails(id);
  }

  @Get('user/my-requests')
  @ApiOperation({ summary: 'Obtener mis solicitudes (usuario autenticado)' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes del usuario', type: [Request] })
  async getMyRequests(@Req() req: ExpressRequest) {
    const user = req.user as User;
    return await this.requestsService.getUserRequestsWithDetails(user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener solicitudes de un usuario específico' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes del usuario', type: [Request] })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserRequests(@Param('userId') userId: string) {
    return await this.requestsService.getUserRequests(userId);
  }

  @Get('subject/:subjectId')
  @ApiOperation({ summary: 'Obtener solicitudes por asignatura' })
  @ApiParam({ name: 'subjectId', description: 'ID de la asignatura' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes para la asignatura', type: [Request] })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  async getSubjectRequests(@Param('subjectId') subjectId: string) {
    return await this.requestsService.getSubjectRequests(subjectId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una solicitud' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({ status: 204, description: 'Solicitud eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async deleteRequest(@Param('id') id: string) {
    await this.requestsService.deleteRequest(id);
  }

  @Delete('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar todas las solicitudes de un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Solicitudes eliminadas exitosamente' })
  async deleteUserRequests(@Param('userId') userId: string) {
    await this.requestsService.deleteUserRequests(userId);
    return { message: 'Solicitudes eliminadas exitosamente' };
  }
}