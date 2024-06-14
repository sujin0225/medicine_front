import { MedicineStoreSearch } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetMedicineStoreSearchResponseDto extends ResponseDto {
    medicineStoreListItems: MedicineStoreSearch[];
}