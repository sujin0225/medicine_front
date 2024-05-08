import axios, { AxiosResponse } from "axios";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, SignInRequestDto, SignUpRequestDto, idCheckRequestDto } from "./request/auth";
import { CheckCertificationResponseDto, EmailCertificationResponseDto, IdCheckResponseDto, SignInResponseDto, SignUpResponseDto } from "./response/auth";
import { GetReviewListResponseDto, PostReviewResponseDto } from "./response/review"
import { PostReviewRequestDto } from "./request/review"
import { ResponseDto } from "./response";
import { error } from "console";

const responseHandler = <T> (response: AxiosResponse<any, any>) => {
    const responseBody: T = response.data
    return responseBody;
};

const errorHandler = (error: any) => {
    if(!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
}

const DOMAIN = 'http://localhost:5050';
const API_DOMAIN = `${DOMAIN}`;

//토큰
const authorization = (accessToken: string) => { 
    return { headers: { Authorization: `Bearer ${accessToken}` }} 
};

export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver') => `${API_DOMAIN}/auth/oauth2/${type}`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const GET_REVIEW_LIST_URL = (ITEM_SEQ: number | string) => `${API_DOMAIN}/review/${ITEM_SEQ}`
const POST_REVIEW_URL = (ITEM_SEQ : number | string) => `${API_DOMAIN}/review/${ITEM_SEQ}`
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const FILE_DOMAIN = `${DOMAIN}/file`;


//아이디 중복 체크
export const idCheckRequest = async (requestBody: idCheckRequestDto) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler<IdCheckResponseDto>)
        .catch(errorHandler);
    return result;    
};

//이메일 인증
export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<EmailCertificationResponseDto>)
        .catch(errorHandler);
    return result;
}

//인증 번호 확인
export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<CheckCertificationResponseDto>)
        .catch(errorHandler);
    return result;
};

//회원가입
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(responseHandler<SignUpResponseDto>)
        .catch(errorHandler);
    return result;
};

//로그인
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(responseHandler<SignInResponseDto>)
        .catch(errorHandler);
    return result;    
}

//리뷰 불러오기
export const GetReviewListRequest = async(ITEM_SEQ: number | string) => {
    const result = await axios.get(GET_REVIEW_LIST_URL(ITEM_SEQ))
        .then(response => {
            const responseBody: GetReviewListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
        return result;
}

//리뷰 글 작성
export const postReviewRequest = async (ITEM_SEQ: number | string, requestBody: PostReviewRequestDto, accessToken: string) => {
    const result = await axios.post(POST_REVIEW_URL(ITEM_SEQ), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostReviewResponseDto = response.data;
            console.log("Review posted successfully:", responseBody);
            return responseBody;
        })
        .catch(error => {
            console.error("Review submission error:", error);
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;    
}

//이미지 업로드
export const fileuploadRequest = async(data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data)
        .then(response => {
            const responseBody: string = response.data;
            console.log("이미지 업로드 성공:", responseBody);
            return responseBody;
        })
        .catch(error => {
            console.error("File upload error:", error);
            return null;
        })
        return result;
    }