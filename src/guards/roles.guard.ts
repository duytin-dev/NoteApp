import { CanActivate, Injectable, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { Role } from "../enum/role.enum";
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(), // method
            context.getClass(), //controller
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        if (!user) {
            return false;
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission to access this resource');

        }

        return true;
    }
}