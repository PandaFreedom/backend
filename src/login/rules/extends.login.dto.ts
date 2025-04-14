import { LoginDto } from '../login';
import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class ExtendsLoginDto extends PartialType(LoginDto) {}
