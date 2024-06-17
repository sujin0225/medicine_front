enum ResponseCode {
    SUCCESS = "SU", //성공
    VALIDATION_FAIL = "VF", //유효성 검증 실패
    DUPLICATE_ID = "DI", //중복된 아이디
    SIGN_IN_FAIL = "SF", //로그인 실패
    CERTIFICATION_FAIL = "CF", //인증 실패
    MAIL_FAIL = "MF", //메일 전송 실패
    DATABASE_ERROR = "DBE", //데이터베이스 에러
    AUTHORIZATION_FAIL = "AF", //인증 실패
    NOT_EXISTED_USER = "NU", //존재하지 않는 유저
    NOT_EXISTED_REVIEW = 'NR' //존재하지 않는 리뷰
};

export default ResponseCode;