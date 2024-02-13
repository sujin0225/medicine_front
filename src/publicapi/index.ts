import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";


const API_KEY = process.env.API_KEY;
const MEDICINE_URL = () => `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?serviceKey=${API_KEY}&type=json&item_name=&entp_name=&item_seq=&img_regist_ts=&pageNo=1&numOfRows=16&edi_code=`;

//의약품 낱알 식별 정보
export const medicine = async () => {
    try {
        const response = await axios.get(MEDICINE_URL());
        const data = response.data;
        console.log("Medicine data:", data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('API 연결 에러:', error);
        throw error;
    }
};