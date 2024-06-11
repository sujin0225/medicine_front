import ResponseDto from "../response.dto";
import { MedicineStore } from "types/interface";

export default interface PostMedicineStoreResponseDto extends ResponseDto {
    medicineStore: MedicineStore[];
}