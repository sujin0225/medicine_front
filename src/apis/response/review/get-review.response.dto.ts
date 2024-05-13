import { Review } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetReviewResponseDto extends ResponseDto, Review {

}