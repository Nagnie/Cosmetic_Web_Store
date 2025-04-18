import { Module } from '@nestjs/common';
import { ComboService } from './combo.service';
import { ComboController } from './combo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from './entities/combo.entity';
import { ComboDetail } from './entities/combo_detail.entity';
import { ComboImage } from './entities/combo_image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combo, ComboDetail, ComboImage])],
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}
