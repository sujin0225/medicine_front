enum ResponseMessage {
     SUCCESS = "성공",
     VALIDATION_FAIL = "유효성 검사 실패",
     DUPLICATE_ID = "중복된 아이디",
     SIGN_IN_FAIL = "로그인 실패",
     CERTIFICATION_FAIL = "이메일 인증 번호 불일치",
     MAIL_FAIL = "메일 전송 실패",
     DATABASE_ERROR = "데이터베이스 오류",
};

export default ResponseMessage;