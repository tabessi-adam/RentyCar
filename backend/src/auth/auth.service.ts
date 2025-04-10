import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from '../clients/entities/client.entity';
import { Admin } from '../admins/entities/admin.entity';
import { Agent } from '../agents/entities/agent.entity';
import { Office } from '../offices/entities/office.entity';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, phoneNumber, role, officeId } = registerDto;

    console.log('Registering user with role:', role);
    console.log('Role type:', typeof role);

    // Check if user already exists with more specific error messages
    const existingClient = await this.clientRepository.findOne({ where: { email } });
    if (existingClient) {
      throw new ConflictException('This email is already registered ');
    }

    const existingAdmin = await this.adminRepository.findOne({ where: { email } });
    if (existingAdmin) {
      throw new ConflictException('This email is already registered ');
    }

    const existingAgent = await this.agentRepository.findOne({ where: { email } });
    if (existingAgent) {
      throw new ConflictException('This email is already registered ');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine if we're creating an admin, agent, or client
    const isAdmin = role === 'admin';
    const isAgent = role === 'agent';
    console.log('isAdmin:', isAdmin, 'isAgent:', isAgent);
    
    let savedUser;

    try {
      if (isAdmin) {
        console.log('Creating admin user');
        // Create new admin
        const newAdmin = this.adminRepository.create({
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          role: Role.ADMIN
        });
        savedUser = await this.adminRepository.save(newAdmin);
        console.log('Admin created:', savedUser);
      } else if (isAgent) {
        console.log('Creating agent user');
        // Check if office exists before creating agent
        if (!officeId) {
          throw new ConflictException('Office ID is required for agent registration');
        }
        
        // Verify office exists
        const office = await this.officeRepository.findOne({ where: { id: officeId } });
        if (!office) {
          throw new NotFoundException('The specified office does not exist. Please provide a valid office ID.');
        }
        
        // Create new agent
        const newAgent = this.agentRepository.create({
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          role: Role.AGENT,
          officeId
        });
        savedUser = await this.agentRepository.save(newAgent);
        console.log('Agent created:', savedUser);
      } else {
        console.log('Creating client user');
        // Create new client
        const newClient = this.clientRepository.create({
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          role: Role.CLIENT
        });
        savedUser = await this.clientRepository.save(newClient);
        console.log('Client created:', savedUser);
      }
    } catch (error) {
      // Re-throw the error if it's already a NestJS exception
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      
      // Handle other database errors
      console.error('Registration error:', error);
      throw new ConflictException('Failed to register user. Please try again.');
    }

    // Remove password from response
    const { password: _, ...result } = savedUser;

    // Generate JWT token
    const payload = { 
      email: savedUser.email, 
      sub: savedUser.id, 
      role: isAdmin ? Role.ADMIN : (isAgent ? Role.AGENT : Role.CLIENT)
    };
    const token = this.jwtService.sign(payload);

    return {
      ...result,
      role: isAdmin ? Role.ADMIN : (isAgent ? Role.AGENT : Role.CLIENT),
      access_token: token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Validating user:', email);
    
    // Check in clients table first
    let user = await this.clientRepository.findOne({ where: { email } });
    
    // If not found in clients, check in admins table
    if (!user) {
      user = await this.adminRepository.findOne({ where: { email } });
    }
    
    // If not found in admins, check in agents table
    if (!user) {
      user = await this.agentRepository.findOne({ where: { email } });
    }
    
    if (!user) {
      console.log('User not found in any table');
      throw new UnauthorizedException('No account found with this email');
    }
    
    if (!await bcrypt.compare(password, user.password)) {
      console.log('Invalid password');
      throw new UnauthorizedException('Incorrect password');
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async validateAdmin(email: string, password: string): Promise<any> {
    console.log('Validating admin:', email);
    
    // Log all admins in the database for debugging
    const allAdmins = await this.adminRepository.find();
    console.log('All admins in database:', allAdmins.map(admin => ({ id: admin.id, email: admin.email, role: admin.role })));
    
    const admin = await this.adminRepository.findOne({ where: { email } });
    console.log('Found admin:', admin);
    
    if (!admin) {
      console.log('Admin not found');
      throw new UnauthorizedException('No account found with this email');
    }
    
    if (!await bcrypt.compare(password, admin.password)) {
      console.log('Invalid password');
      throw new UnauthorizedException('Incorrect password');
    }
    
    const { password: _, ...result } = admin;
    return result;
  }

  async validateAgent(email: string, password: string) {
    const agent = await this.agentRepository.findOne({ where: { email } });
    if (!agent) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, agent.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return agent;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role
    };
    
    // Create the response object
    const response = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber
      }
    };
    
    console.log('Login response structure:', response);
    
    return response;
  }

  async loginAdmin(admin: any) {
    const payload = { 
      email: admin.email, 
      sub: admin.id, 
      role: Role.ADMIN
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginAgent(agent: Agent) {
    const payload = { 
      email: agent.email, 
      sub: agent.id, 
      role: Role.AGENT 
    };
    const token = this.jwtService.sign(payload);

    const { password: _, ...result } = agent;
    return {
      ...result,
      role: Role.AGENT,
      access_token: token,
    };
  }

  async checkDatabaseStructure() {
    try {
      // Check if admin table exists
      const adminTableExists = await this.adminRepository.query(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'admins'",
        [process.env.DB_NAME || 'rentycar']
      );
      console.log('Admin table exists:', adminTableExists.length > 0);
      
      if (adminTableExists.length > 0) {
        // Check admin table structure
        const adminTableStructure = await this.adminRepository.query(
          "SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'admins'",
          [process.env.DB_NAME || 'rentycar']
        );
        console.log('Admin table structure:', adminTableStructure);
        
        // Check if there are any admins in the table
        const adminCount = await this.adminRepository.count();
        console.log('Number of admins in database:', adminCount);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error checking database structure:', error);
      return { success: false, error: error.message };
    }
  }
} 