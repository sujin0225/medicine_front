import { FavoriteMedicine } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetFavoriteMedicineResponseDto extends ResponseDto  {
    favoriteListItems: FavoriteMedicine[];
}