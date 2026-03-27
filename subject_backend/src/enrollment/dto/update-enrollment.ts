import { PartialType } from "@nestjs/mapped-types";
import { CreateEnrollmentDto } from "./create-enrollment";

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto){

}