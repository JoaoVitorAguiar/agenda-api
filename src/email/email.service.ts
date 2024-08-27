import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: {
    to: string[];
    subject: string;
    text?: string;
    html?: string;
  }): Promise<{ success: boolean }> {
    try {
      await this.mailerService.sendMail({
        to: options.to.join(','),
        from: '"No Reply" <no-reply@example.com>', // Alterar conforme necessário
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
      };
    }
  }
}
