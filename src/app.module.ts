import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailersModule } from './mailers/mailers.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    DatabaseModule,
    EventsModule,
    MailersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
