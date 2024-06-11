import { MedicineInfo } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetMedicineInfoResponseDto extends ResponseDto, MedicineInfo {
    
}