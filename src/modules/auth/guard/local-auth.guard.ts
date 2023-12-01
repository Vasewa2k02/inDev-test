import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LOCAL } from '../constants/guard';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL) {}
