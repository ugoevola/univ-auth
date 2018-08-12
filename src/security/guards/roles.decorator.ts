import { ReflectMetadata } from '@nestjs/common';
import { Role } from '../../repository/schema/role.enum';

export const Roles = (...roles:  Array<Role>) => ReflectMetadata('roles', roles);
