import { Module } from '@nestjs/common';
import { PostgreService } from './postgre.service';
import { MongoService } from './mongo.service';
import { SyncdbService } from './syncdb.service';

@Module({
  providers: [PostgreService, MongoService, SyncdbService],
  exports: [PostgreService, MongoService, SyncdbService],
})
export class PrismaModule {}
