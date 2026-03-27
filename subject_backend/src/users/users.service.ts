import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FacultyEnum } from './enum/faculty.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Registro de usuario
  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, name, password, role, country, faculty } = createUserDto;
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
        email,
        username,
        name,
        country,
        password: hashedPassword,
        role: role || UserRole.USER, 
        faculty: faculty || FacultyEnum.FTL, 
    });

    return this.userRepository.save(newUser);
    }


  // Login básico (sin JWT todavía)
  async validateUser(loginDto: LoginUserDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Credenciales inválidas');

    return user;
  }

  // Obtener todos los usuarios
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Obtener usuario por id
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // Actualizar usuario
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  // Eliminar usuario (desactivar)
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
