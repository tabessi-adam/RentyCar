import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';
import { AdminVehiclesController } from './controllers/admin-vehicles.controller';
import { ClientVehiclesController } from './controllers/client-vehicles.controller';
import { AgentVehiclesController } from './controllers/agent-vehicles.controller';
import { Agent } from '../agents/entities/agent.entity';
import { Office } from '../offices/entities/office.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Agent, Office])],
  controllers: [AdminVehiclesController, ClientVehiclesController, AgentVehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {} 