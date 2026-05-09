import { PartialType } from "@nestjs/mapped-types";
import { CreateContentDistributionDto } from "./create-content-distribution.dto";

export class UpdateContentDistributionDto extends PartialType(CreateContentDistributionDto){

}