import { Module } from '@nestjs/common';
import { DietaryRestrictionService } from './services/dietary-restriction.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [DietaryRestrictionService],
  exports: [DietaryRestrictionService],
})
export class DietaryRestrictionModule {}
