import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema  } from 'zod';

/**
 * Zod Validation Pipe to parse HTTP requests
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } 
    catch (error) {
      throw new BadRequestException(`${metadata.data} is wrongly formatted.`);
    }
  }
}