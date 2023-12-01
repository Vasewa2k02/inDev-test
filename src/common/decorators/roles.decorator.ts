import { SetMetadata } from '@nestjs/common';

import { METADATA_KEYS } from '../constants/env-variables';
import { Role } from '../enums/role.enum';

export const Roles = (...roles: Role[]) =>
  SetMetadata(METADATA_KEYS.roles, roles);
