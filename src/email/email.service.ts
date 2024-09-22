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

  async sendMeetingReminder(
    to: string[],
    meeting: { title: string; description: string; date: Date },
  ): Promise<{ success: boolean }> {
    const subject = `Lembrete: Reunião "${meeting.title}" vai começar em breve`;

    const htmlContent = `
      <p>Olá,</p>
      <p>Este é um lembrete para a reunião <strong>${meeting.title}</strong> que está marcada para acontecer em:</p>
      <p><strong>Data:</strong> ${meeting.date.toLocaleString()}</p>
      <p><strong>Descrição:</strong> ${meeting.description}</p>
      <p>Por favor, certifique-se de estar pronto(a) a tempo.</p>
      <p>Atenciosamente,<br>Equipe de Reuniões</p>
    `;

    return this.sendMail({
      to,
      subject,
      html: htmlContent,
    });
  }
}
