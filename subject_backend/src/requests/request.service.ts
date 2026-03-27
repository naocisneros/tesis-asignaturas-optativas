import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "src/subjects/entity/subject.entity";
import { User } from "src/users/entity/users.entity";
import { Repository } from "typeorm";
import { Request } from "./entity/request.entity";
import { CreateRequestDto } from "./dto/create-request.dto";
import { CreateBulkRequestsDto } from "./dto";

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  
  async createRequest(createRequestDto: CreateRequestDto): Promise<Request> {
    
    const user = await this.userRepository.findOne({
      where: { id: createRequestDto.userId }
    });
    
    const subject = await this.subjectRepository.findOne({
      where: { id: createRequestDto.subjectId }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }

    const request = this.requestRepository.create({
      user, 
      subject, 
      option: createRequestDto.option,
      description: createRequestDto.description,
    });

    return await this.requestRepository.save(request);
  }

  
  async createBulkRequests(createBulkRequestsDto: CreateBulkRequestsDto): Promise<Request[]> {
    const { requests, sessionId } = createBulkRequestsDto;

    if (requests.length > 14) {
      throw new Error('No se pueden enviar más de 14 solicitudes');
    }

    const createdRequests: Request[] = [];

    for (const requestDto of requests) {
      const user = await this.userRepository.findOne({
        where: { id: requestDto.userId }
      });
      
      const subject = await this.subjectRepository.findOne({
        where: { id: requestDto.subjectId }
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${requestDto.userId} no encontrado`);
      }
      
      if (!subject) {
        throw new NotFoundException(`Asignatura con ID ${requestDto.subjectId} no encontrada`);
      }

      const request = this.requestRepository.create({
        user,
        subject,
        option: requestDto.option,
        description: requestDto.description,
      });

      const savedRequest = await this.requestRepository.save(request);
      createdRequests.push(savedRequest);
    }

    return createdRequests;
  }

  async getRequestWithDetails(id: string): Promise<any> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['user', 'subject'] 
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return {
      id: request.id,
      option: request.option,
      description: request.description,
      user: {
        id: request.user.id,
        email: request.user.email,
        name: request.user.name,
        username: request.user.username
      },
      subject: {
        id: request.subject.id,
        nombre: request.subject.nombre,
        descripción: request.subject.descripción,
        categoría: request.subject.categoría,
        sección: request.subject.sección,
        matrícula: request.subject.matrícula,
        estado: request.subject.estado
      }
    };
  }

  async getUserRequests(userId: string): Promise<Request[]> {
    return await this.requestRepository.find({
      where: { user: { id: userId } },
      relations: ['subject'], 
      order: { option: 'ASC' }
    });
  }

 
  async getSubjectRequests(subjectId: string): Promise<Request[]> {
    return await this.requestRepository.find({
      where: { subject: { id: subjectId } },
      relations: ['user'], 
      order: { option: 'ASC' }
    });
  }

  
  async getUserRequestsWithDetails(userId: string): Promise<any[]> {
    const requests = await this.requestRepository.find({
      where: { user: { id: userId } },
      relations: ['subject'],
      order: { option: 'ASC' }
    });

    return requests.map(request => ({
      id: request.id,
      option: request.option,
      description: request.description,
      subject: {
        id: request.subject.id,
        nombre: request.subject.nombre,
        descripción: request.subject.descripción,
        categoría: request.subject.categoría,
        sección: request.subject.sección,
        matrícula: request.subject.matrícula,
        estado: request.subject.estado
      }
    }));
  }

  
  async deleteUserRequests(userId: string): Promise<void> {
    await this.requestRepository.delete({ user: { id: userId } });
  }

  
  async userHasRequests(userId: string): Promise<boolean> {
    const count = await this.requestRepository.count({
      where: { user: { id: userId } }
    });
    return count > 0;
  }

  async getUserRequestCounts(userId: string): Promise<{ [key: number]: number }> {
    const requests = await this.requestRepository.find({
      where: { user: { id: userId } },
      select: ['option']
    });

    const counts: { [key: number]: number } = {};
    requests.forEach(request => {
      counts[request.option] = (counts[request.option] || 0) + 1;
    });

    return counts;
  }

  async getAllRequests(): Promise<Request[]> {
    return await this.requestRepository.find({
        relations: ['user', 'subject']
    });
    }

  async deleteRequest(id: string): Promise<void> {
    const result = await this.requestRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException('Solicitud no encontrada');
    }

    }
}