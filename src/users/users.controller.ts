import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-up')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() { email, password }: SignInDto) {
    const user = await this.usersService.findByEmail(email);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.signIn(user.id, password);

    return {
      token,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll() {
    const users = await this.usersService.findAll();

    return users;
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async profile(@Request() req,) {
    const user_id = req.user.sub
    const user = await this.usersService.findOne(user_id);

    return {
      ...user.toObject(), 
      password: undefined, 
    };
  }
}