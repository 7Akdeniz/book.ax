import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LocationsModule,
  ],
})
export class AppModule {}
