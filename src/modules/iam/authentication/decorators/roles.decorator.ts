import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../enums/user-type.enum';
import { ROLES_KEY } from '../../iam.constants';

export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
