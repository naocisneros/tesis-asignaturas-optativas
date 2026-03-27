import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Public } from './public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en el sistema'
  })
  @ApiBody({ 
    type: CreateUserDto,
    description: 'Datos del nuevo usuario',
    examples: {
      example1: {
        summary: 'Registro de usuario básico',
        value: {
          email: 'usuario@ejemplo.com',
          password: 'password123',
          username: 'mi_usuario'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201,
    description: 'Usuario registrado exitosamente',
    examples: {
      success: {
        summary: 'Registro exitoso',
        value: {
          message: "Usuario registrado correctamente",
          user: {
            id: "8eaec2c3-f857-4dc0-9838-5cddff163fcf",
            email: "caronte@example.com",
            username: "caronte",
            password: "$2b$10$fJWUWxwpehmJshd0sh/5rOYtyoAFl2nKnEs8MSfXKiCC0L0p5lzyO",
            role: "user",
            isActive: true,
            createdAt: "2025-10-26T02:37:16.127Z",
            updatedAt: "2025-10-26T02:37:16.127Z"
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400,
    description: 'Datos de entrada inválidos o usuario ya existe',
    examples: {
      validationError: {
        summary: 'Error de validación',
        value: {
          message: [
            'email must be an email',
            'password must be longer than or equal to 6 characters',
            'username must be longer than or equal to 3 characters'
          ],
          error: 'Bad Request',
          statusCode: 400
        }
      },
      userExists: {
        summary: 'Usuario ya existe',
        value: {
          message: 'El usuario ya existe',
          error: 'Bad Request',
          statusCode: 400
        }
      }
    }
  })
  @ApiResponse({ 
    status: 500,
    description: 'Error interno del servidor',
    examples: {
      internalError: {
        summary: 'Error del servidor',
        value: {
          message: 'Error interno del servidor',
          error: 'Internal Server Error',
          statusCode: 500
        }
      }
    }
  })
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión y obtener token JWT',
    description: 'Autentica al usuario con email y contraseña, retorna un token JWT para acceder a endpoints protegidos'
  })
  @ApiBody({ 
    type: LoginUserDto,
    description: 'Credenciales de autenticación',
    examples: {
      example1: {
        summary: 'Credenciales de ejemplo',
        value: {
          email: 'usuario@ejemplo.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200,
    description: 'Login exitoso, retorna token JWT',
    examples: {
      success: {
        summary: 'Respuesta exitosa',
        value: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401,
    description: 'Credenciales inválidas',
    examples: {
      invalidCredentials: {
        summary: 'Error de autenticación',
        value: {
          message: 'Credenciales inválidas',
          error: 'Unauthorized',
          statusCode: 401
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400,
    description: 'Datos de entrada inválidos',
    examples: {
      validationError: {
        summary: 'Error de validación',
        value: {
          message: [
            'email must be an email',
            'password must be longer than or equal to 6 characters'
          ],
          error: 'Bad Request',
          statusCode: 400
        }
      }
    }
  })
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Cerrar sesión',
    description: 'Cierra la sesión del usuario. El cliente debe eliminar el token JWT.'
  })
  @ApiResponse({ 
    status: 200,
    description: 'Logout exitoso',
    examples: {
      success: {
        summary: 'Logout completado',
        value: {
          message: 'Logout exitoso. Elimina el token del cliente.',
          timestamp: '2024-01-15T10:30:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
    examples: {
      unauthorized: {
        summary: 'Error de autenticación',
        value: {
          message: 'Unauthorized',
          statusCode: 401
        }
      }
    }
  })
  async logout() {
    return this.authService.logout();
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar el token de acceso',
    description:
      'Recibe un refresh token válido y devuelve un nuevo access token. No requiere autenticación previa.',
  })
  @ApiBody({
    description: 'Refresh token emitido durante el login',
    required: true,
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Nuevo token de acceso generado correctamente.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        expires_in: { type: 'number', example: 3600 },
        expires_at: { type: 'string', example: '2025-11-10T18:05:32.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado.',
  })
  async refresh(@Body('refresh_token') refresh_token: string) {
    return this.authService.refreshToken(refresh_token);
  }
}
