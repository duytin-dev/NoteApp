import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';


export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => { // cho phép truyền nhiều vai trò vào decorator Roles
    return SetMetadata(ROLES_KEY, roles);
};