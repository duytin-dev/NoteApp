import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { PaginateDto } from "../../../utils/page.dto";

export class NoteQueryDto extends PaginateDto {

    @IsOptional()
    @IsString()
    keyword?: string;
}