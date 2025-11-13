import { Module, CacheModule } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { AdminLocationsController } from './admin-locations.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5 minutes cache
      max: 1000,
    }),
  ],
  controllers: [LocationsController, AdminLocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
