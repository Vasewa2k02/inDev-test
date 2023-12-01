import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from './constants/env-variables';
import { Auth, Tls } from './types/common';

@Injectable()
export class NodemailerTransport {
  private host: string;
  private port: number;
  private secure = false;
  private connectionTimeout?: number;
  private auth: Auth;
  private tls?: Tls;
  private ignoreTLS?: boolean;

  constructor(private configService: ConfigService) {
    this.host = this.configService.get(SMTP_HOST);
    this.port = Number(this.configService.get(SMTP_PORT));
    this.auth = {
      user: this.configService.get(SMTP_USER),
      pass: this.configService.get(SMTP_PASSWORD),
    };
  }

  public setHost(host: string): NodemailerTransport {
    this.host = host;
    return this;
  }

  public setPort(port: number): NodemailerTransport {
    this.port = port;
    return this;
  }

  public setSecure(secure: boolean): NodemailerTransport {
    this.secure = secure;
    return this;
  }

  public setConnectionTimeout(connectionTimeout: number): NodemailerTransport {
    this.connectionTimeout = connectionTimeout;
    return this;
  }

  public setAuth(auth: Auth): NodemailerTransport {
    this.auth = auth;
    return this;
  }

  public setTls(tls: Tls): NodemailerTransport {
    this.tls = tls;
    return this;
  }

  public setIgnoreTLS(ignoreTLS: boolean): NodemailerTransport {
    this.ignoreTLS = ignoreTLS;
    return this;
  }
}
