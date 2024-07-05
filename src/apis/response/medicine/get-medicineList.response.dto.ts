import { MedicineListItem } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetMedicineListResponseDto extends ResponseDto {
    medicineListItems: MedicineListItem[],
    totalCount: number;
}