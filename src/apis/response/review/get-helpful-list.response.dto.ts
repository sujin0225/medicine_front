import { HelpfulListItem } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetHelpfulResponseDto extends ResponseDto {
    helpfulList: HelpfulListItem[]
}