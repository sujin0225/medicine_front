import { Medicine } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetMedicineResponeDto extends ResponseDto, Medicine {
    
}