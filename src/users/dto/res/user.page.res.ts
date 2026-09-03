import { UserResponse } from "./user.res";

export class UserPaginate {
    data: UserResponse[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
}