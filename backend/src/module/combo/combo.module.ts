import { Module } from '@nestjs/common';
import { ComboService } from './combo.service';
import { ComboController } from './combo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from './entities/combo.entity';
import { ComboDetail } from './entities/combo_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combo, ComboDetail])],
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}
