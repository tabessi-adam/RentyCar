import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { Office } from '../offices/entities/office.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    // Check if agent with this email already exists
    const existingAgent = await this.agentRepository.findOne({ 
      where: { email: createAgentDto.email } 
    });
    
    if (existingAgent) {
      throw new ConflictException('An agent with this email already exists');
    }

    // Check if office exists
    const office = await this.officeRepository.findOne({
      where: { id: createAgentDto.officeId },
    });

    if (!office) {
      throw new NotFoundException(`Office with ID ${createAgentDto.officeId} not found`);
    }

    const hashedPassword = await bcrypt.hash(createAgentDto.password, 10);
    const agent = this.agentRepository.create({
      ...createAgentDto,
      password: hashedPassword,
    });
    return await this.agentRepository.save(agent);
  }

  async findAll(): Promise<Agent[]> {
    return this.agentRepository.find();
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async findByOffice(officeId: string): Promise<Agent[]> {
    return this.agentRepository.find({ where: { officeId } });
  }

  async update(id: string, updateAgentDto: Partial<CreateAgentDto>): Promise<Agent> {
    const agent = await this.findOne(id);
    if (updateAgentDto.password) {
      updateAgentDto.password = await bcrypt.hash(updateAgentDto.password, 10);
    }
    Object.assign(agent, updateAgentDto);
    return await this.agentRepository.save(agent);
  }

  async remove(id: string): Promise<void> {
    const result = await this.agentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
  }
} 