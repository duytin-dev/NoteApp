import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

export class PaginateDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit: number = 10;
}