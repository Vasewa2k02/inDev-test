import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { NodemailerTransport } from './nodemailer-transport.class';
import { CONNECTION_TIMEOUT } from './constants/common';
import { SMTP_USER } from './constants/env-variables';

@Injectable()
export class MailService {
  private transport: nodemailer.Transporter;

  constructor(
    private nodemailerTransport: NodemailerTransport,
    private configService: ConfigService,
  ) {}

  public async sendLinkToResetPasword(
    reciverEmail: string,
    link: string,
  ): Promise<void> {
    const transportOptions =
      this.nodemailerTransport.setConnectionTimeout(CONNECTION_TIMEOUT);

    try {
      this.transport = nodemailer.createTransport({
        ...transportOptions,
      });

      await this.transport.sendMail({
        to: reciverEmail,
        from: this.configService.get(SMTP_USER),
        subject: 'Сброс пароля ',
        html: `
      <div>
        <h2>Перейдите по следующей ссылки для сброса пароля:</h2>
        <p>${link}</p>
      </div>`,
      });

      this.transport.close();
    } catch (error) {
      this.transport.close();
      throw error;
    }
  }
}
