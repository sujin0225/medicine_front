import { ReviewListItem } from 'types/interface';
import ResponseDto from "../response.dto";

export default interface GetReviewListResponseDto extends ResponseDto {
    reviewListItems: ReviewListItem[];
}