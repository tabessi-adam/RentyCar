import { Controller, Post, Body, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('Login attempt with:', loginDto);
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      console.log('User validated successfully:', user);
      const result = await this.authService.login(user);
      console.log('Login successful, returning:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // The error message is already set in the service
    }
  }

  @Post('admin/login')
  async adminLogin(@Body() loginDto: { email: string; password: string }) {
    try {
      const admin = await this.authService.validateAdmin(loginDto.email, loginDto.password);
      return this.authService.loginAdmin(admin);
    } catch (error) {
      throw error; // The error message is already set in the service
    }
  }

  @Post('agent/login')
  async agentLogin(@Body() loginDto: { email: string; password: string }) {
    try {
      const agent = await this.authService.validateAgent(loginDto.email, loginDto.password);
      return this.authService.loginAgent(agent);
    } catch (error) {
      throw error; // The error message is already set in the service
    }
  }

  @Get('check-db')
  async checkDatabase() {
    return this.authService.checkDatabaseStructure();
  }
} 