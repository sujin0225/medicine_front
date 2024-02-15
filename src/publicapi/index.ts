import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";


const API_KEY = process.env.REACT_APP_API_KEY;

const MEDICINE_URL = (pageNo: number) => `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?serviceKey=${API_KEY}&type=json&item_name=&entp_name=&item_seq=&img_regist_ts=&pageNo=${pageNo}&numOfRows=16&edi_code=`;
const MEDICINE_SEARCH_URL = (searchWord: string) => `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?serviceKey=${API_KEY}&type=json&item_name=${searchWord}&entp_name=&item_seq=&img_regist_ts=&pageNo=1&numOfRows=16&edi_code=`;
const MEDICINE_DETAIL_URL = (ITEM_SEQ: string) => `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?serviceKey=${API_KEY}&type=json&item_name=&entp_name=&item_seq=${ITEM_SEQ}&img_regist_ts=&pageNo=1&numOfRows=16&edi_code=`;

//의약품 낱알 식별 정보
export const medicine = async (pageNo: number) => {
    try {
        const response = await axios.get(MEDICINE_URL(pageNo));
        const data = response.data;
        console.log("Medicine data:", data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('API 연결 에러:', error);
        throw error;
    }
};

//의약품 낱알 식별 검색 리스트
export const medicineSearch = async (searchWord: string) => {
    try {
        const response = await axios.get(MEDICINE_SEARCH_URL(searchWord));
        const data = response.data;
        console.log("Medicine_search_data:", data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('API 연결 에러:', error);
        throw error;
    }
};

//의약품 상세 정보
export const medicineDetail = async (ITEM_SEQ: string) => {
    try {
        const response = await axios.get(MEDICINE_DETAIL_URL(ITEM_SEQ));
        const data = response.data;
        console.log("Medicine_Detail_data:", data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('API 연결 에러:', error);
        throw error;
    }
};