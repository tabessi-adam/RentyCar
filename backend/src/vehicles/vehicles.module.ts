import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleImage } from './entities/vehicle-image.entity';
import { VehiclesService } from './vehicles.service';
import { AdminVehiclesController } from './controllers/admin-vehicles.controller';
import { ClientVehiclesController } from './controllers/client-vehicles.controller';
import { AgentVehiclesController } from './controllers/agent-vehicles.controller';
import { Agent } from '../agents/entities/agent.entity';
import { Office } from '../offices/entities/office.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, VehicleImage, Agent, Office]),
    CloudinaryModule,
  ],
  controllers: [AdminVehiclesController, ClientVehiclesController, AgentVehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {} 