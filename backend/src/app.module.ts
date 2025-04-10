import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { AdminsModule } from './admins/admins.module';
import { Client } from './clients/entities/client.entity';
import { Admin } from './admins/entities/admin.entity';
import { Vehicle } from './vehicles/entities/vehicle.entity';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ReservationsModule } from './reservations/reservations.module';
import { Reservation } from './reservations/entities/reservation.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/review.entity';
import { Agent } from './agents/entities/agent.entity';
import { Office } from './offices/entities/office.entity';
import { AgentsModule } from './agents/agents.module';
import { OfficesModule } from './offices/offices.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'rentycar',
      entities: [Client, Admin, Vehicle, Reservation, Review, Agent, Office],
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      logging: true,
      logger: 'advanced-console',
    }),
    AuthModule,
    ClientsModule,
    AdminsModule,
    VehiclesModule,
    ReservationsModule,
    ReviewsModule,
    AgentsModule,
    OfficesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
