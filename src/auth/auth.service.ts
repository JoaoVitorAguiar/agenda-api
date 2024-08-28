import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async signIn(id: string, email: string): Promise<string> {
    const payload = { sub: id, email: email };

    return await this.jwtService.signAsync(payload);
  }
}
