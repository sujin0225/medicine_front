import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import convert from 'xml-js';


const API_KEY = process.env.REACT_APP_API_KEY;
const STORE_API_KEY = process.env.REACT_APP_STORE_KEY;

const MEDICINE_URL = (pageNo: number) => `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?serviceKey=${API_KEY}&type=json&item_name=&entp_name=&item_seq=&img_regist_ts=&pageNo=${pageNo}&numOfRows=16&edi_code=`;
const MEDICINE_SEARCH_URL = (searchWord: string, pageNo: number) => `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?serviceKey=${API_KEY}&type=json&item_name=${searchWord}&entp_name=&item_seq=&img_regist_ts=&pageNo=${pageNo}&numOfRows=16&edi_code=`;
// const MEDICINE_DETAIL_URL = (ITEM_SEQ: string) => `http://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService01/getMdcinGrnIdntfcInfoList01?serviceKey=${API_KEY}&type=json&item_name=&entp_name=&item_seq=${ITEM_SEQ}&img_regist_ts=&pageNo=1&numOfRows=16&edi_code=`;
const MEDICINE_PERMISSION_URL = (ITEM_SEQ: string) => `https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService05/getDrugPrdtPrmsnDtlInq03?serviceKey=${API_KEY}&type=json&item_seq=${ITEM_SEQ}`;
const MEDICINE_INFO_URL = (ITEM_SEQ: string) => `http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=${API_KEY}&type=json&itemSeq=${ITEM_SEQ}`;
const MEDICINE_STORE_URL = () => `http://openapi.seoul.go.kr:8088/${STORE_API_KEY}/json/LOCALDATA_010105/1/5/`
const BACK_URL = (ITEM_SEQ: string) => `http://localhost:5050/review/${ITEM_SEQ}`;

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
export const medicineSearch = async (searchWord: string, pageNo: number) => {
    try {
        const response = await axios.get(MEDICINE_SEARCH_URL(searchWord, pageNo));
        const data = response.data;
        console.log("Medicine_search_data:", data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('API 연결 에러:', error);
        throw error;
    }
};

//의약품 상세 정보
// export const medicineDetail = async (ITEM_SEQ: string) => {
//     try {
//         const response = await axios.get(MEDICINE_DETAIL_URL(ITEM_SEQ));
//         const data = response.data;
//         console.log("Medicine_Detail_data:", data); // 데이터 확인용 로그
//         return data;
//     } catch (error) {
//         console.error('API 연결 에러:', error);
//         throw error;
//     }
// };

//의약품 제품 허가정보
export const medicinepermission = async (ITEM_SEQ: string) => {
    try {
        const response = await axios.get(MEDICINE_PERMISSION_URL(ITEM_SEQ));
        const data = response.data;
        console.log("Medicine_Permisson_data:", data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('API 연결 에러:', error);
        throw error;
    }
};

//의약품 복약 정보
export const medicineinfo = async (ITEM_SEQ: string) => {
    try {
        const response = await axios.get(MEDICINE_INFO_URL(ITEM_SEQ));
        const data = response.data;
        console.log("Medicine_info_data:", data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('API 연결 에러:', error);
        throw error;
    }
};

//상비약 판매처
// export const medicinestore = async (START_INDEX: string, END_INDEX: string) => {
//     try {
//         const response = await axios.get(MEDICINE_STORE_URL(START_INDEX, END_INDEX));
//         const data = response.data;
//         console.log("상비약 판매처:", data); // 데이터 확인용 로그
//         return data;
//     } catch (error) {
//         console.error('API 연결 에러:', error);
//         throw error;
//     }
// };



export const medicinestore = async () => {
    try {
        const response = await axios.get(MEDICINE_STORE_URL());
        const data = response.data;
        console.log("상비약 판매처:", data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('API 연결 에러:', error);
        throw error;
    }
};