import { MyReview } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetMyReviewResponseDto extends ResponseDto {
    reviewListItems: MyReview[];
}