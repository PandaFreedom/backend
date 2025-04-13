import { LoginDto } from '../login.dto';
import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class ExtendsLoginDto extends PartialType(LoginDto) {}
