import CreateMediaInput from './create-media.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMediaInput extends PartialType(CreateMediaInput) {
  id: number;
}
