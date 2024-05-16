import ResponseDto from '../response.dto';

export default interface GetPopularListReponseDto extends ResponseDto {
    popularWordList: string[];
}