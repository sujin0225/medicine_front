import React, { useEffect, useState } from 'react'
import './style.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Search from 'components/Search/Search';
import markerImage from './image/marker.png';
import { medicinestore } from 'publicapi';
import { MedicineStore } from 'types/interface';
import proj4 from 'proj4';
declare const kakao: any;

export default function Store() {
  const [startIndex, setStartIndex] = useState('0'); // 시작 인덱스 상태
  const [endIndex, setEndIndex] = useState('5'); // 종료 인덱스 상태
  const [medicineStore, setMedicineStore] = useState<MedicineStore[]>([]);
  const [locations, setLocations] = useState<[string, string, string][]>([]);

  //변환된 위도, 경도값 저장
  const [transformedCoord, setTransformedCoord] = useState<[number, number][] | null>(null);
  const [nametransformedCoord, setNameTransformedCoord] = useState<Location[] | null>(null);
  const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
  const webMercator = '+proj=tmerc +lat_0=38 +lon_0=127 +k=0.9996 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs';

  type Location = {
    name: string;
    coords: [number, number];
  };

  //슬라이드 효과
  useEffect(() => {
    AOS.init({duration: 2000});
  }, []);

//   const fetchData = async (START_INDEX: string, END_INDEX: string) => {
//     try {
//         const data = await medicinestore(START_INDEX, END_INDEX); 
//         // setMedicineStore(data.LOCALDATA_010105.row); 
//         console.log("상비약 판매처 찾기:", data.LOCALDATA_010105.row); 
//         const locations = data.LOCALDATA_010105.row.map((spot: MedicineStore) =>[
//           spot.BPLCNM,
//           spot.X,
//           spot.Y
//         ]);
//         console.log(locations);
//         setLocations(locations);
//     } catch (error) {
//         console.error('데이터 불러오기 에러:', error);
//     }
// };

const fetchData = async () => {
  try {
      const data = await medicinestore(); 
      // setMedicineStore(data.LOCALDATA_010105.row); 
      console.log("상비약 판매처 찾기:", data.LOCALDATA_010105_NW.row); 
      const locations = data.LOCALDATA_010105_NW.row.map((spot: MedicineStore) =>[
        spot.BPLCNM,
        spot.X,
        spot.Y
      ]);
      console.log(locations);
      setLocations(locations);
  } catch (error) {
      console.error('데이터 불러오기 에러:', error);
  }
};

// useEffect(() => {
//   fetchData(startIndex, endIndex);
// }, [startIndex, endIndex])

useEffect(() => {
  fetchData();
}, [])

useEffect(() => {
  handleConvert();
}, [locations]);

// 문자열 좌표값과 이름을 파싱하는 함수
function parseCoordinates(coordString: string): {name: string, coords: [number, number]} | null {
  // 문자열을 쉼표로 분리
  const parts = coordString.split(',');

  // 부분이 정확히 세 개인지 확인 (이름, 위도, 경도)
  if (parts.length === 3) {
    const name = parts[0].trim(); // 위치 이름
    const lon = parseFloat(parts[1].trim()); // 경도
    const lat = parseFloat(parts[2].trim()); // 위도

    // 숫자 변환이 유효한지 확인
    if (!isNaN(lon) && !isNaN(lat)) {
      return {name, coords: [lon, lat]};
    }
  }

  // 유효하지 않은 경우 null 반환
  return null;
}

//문자열 정수형으로 변환
const handleConvert = () => {
  const locationStrings = locations.map(loc => `${loc[0]},${loc[1]},${loc[2]}`);
  console.log("변환 전 문자열:", locationStrings);
  
  const tempTransformedCoords: [number, number][] = [];
  const nameAndCoords: {name: string, coords: [number, number]}[] = [];

  locationStrings.forEach(locationString => {
    const parsed = parseCoordinates(locationString);
    if (parsed) {
      // 좌표 변환 실행
      const result = proj4(webMercator, wgs84, parsed.coords);
      tempTransformedCoords.push(result as [number, number]);
      nameAndCoords.push({name: parsed.name, coords: result as [number, number]}); // 별도로 이름과 좌표를 저장
    } else {
      alert('유효한 좌표값을 입력하세요.');
    }
  });

  // 변환된 좌표만 상태로 설정
  // setTransformedCoord(tempTransformedCoords);
  setNameTransformedCoord(nameAndCoords);
  console.log("변환 후 좌표:", tempTransformedCoords);
  console.log("이름과 좌표:", nameAndCoords);
  // 이름과 좌표를 함께 관리해야 하는 경우, nameAndCoords 배열을 사용
};

//지도+마커 표시하기
useEffect(() => {
  const container = document.getElementById('map');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 3
      };

      const map = new kakao.maps.Map(container, options);

      // nameTransformedCoord가 null이 아니면 마커를 생성하는 로직을 실행
      if (nametransformedCoord) {
        nametransformedCoord.forEach(({name, coords}) => { // 구조 분해 할당을 사용하여 name과 coords에 접근
          const [x, y] = coords; // coords는 [number, number] 타입
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(y, x), // 위도(y), 경도(x) 순서로 설정
            image: new kakao.maps.MarkerImage(markerImage, new kakao.maps.Size(50, 50), {
              offset: new kakao.maps.Point(25, 50),
            })   
          });
          marker.setMap(map);
          const infowindow = new kakao.maps.InfoWindow({
            content: name, // 각 마커별 이름 사용
          });

          // 마커에 클릭 이벤트 리스너 추가
          kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });
        });
      }
    },
    (error) => {
      console.error("Geolocation error: ", error); 
    }
  );
}, [nametransformedCoord]); // 의존성 배열에 올바른 상태 변수명 사용

  return (
    <>
    <div className='store-background-image'>
      <div id='store'>
        <div className='store-background-container'>
          <div className='store-text-box'>
            <div className='store-image-text-title-bold'>상비약</div>
            <div className='store-image-text-title'> 판매처 찾기</div>
          </div>
          <div className='store-text-box-content'>
            <div className='store-image-text-content'>안전상비의약품을 판매하는 편의점의 위치 정보를 제공합니다.</div>
          </div>
          </div>
      </div>
    </div>
    <div id='store-middle-wrapper'>
      <div data-aos="fade-right" className='store-middle-background-container'>
        <div className='store-text-box-title'>
          <div className='store-text-title-gold'>편의점 상비약이란?</div>
        </div>
        <div className='store-box-content'>
          <div className='store-content-box-content'>의사 처방 없이 환자가 직접 구매할 수 있는 일반 의약품 중</div>
          <div className='store-content-box-content'>약국이 아닌 24시 편의점에서 판매되는 품목입니다.</div>
        </div>
      </div>
    </div>
    <div id='store-gold-background'>
      <div className='store-box-gap'>
        <div data-aos="slide-right" className='store-gold-content-box'>
          <div className='store-cold-medicine-image'></div>
          <div className='store-box-content-text'>감기약</div>
        </div>
        <div data-aos="slide-right" className='store-gold-content-box'>
          <div className='store-fever-reducer-image'></div>
          <div className='store-box-content-text'>해열진통제</div>
        </div>
        <div data-aos="slide-right" className='store-gold-content-box'>
          <div className='store-digestive_medicine-image'></div>
          <div className='store-box-content-text-digestive'>소화제</div>
        </div>
        <div data-aos="slide-right" className='store-gold-content-box'>
          <div className='store-plaster-image'></div>
          <div className='store-box-content-text-plaster'>소염진통제(파스)</div>
        </div>
      </div>
    </div>
    <div id='store'>
      <div className='store-map-container'>
        <Search />
        <div id="map"></div>
      </div>
    </div>
    </>
  )
}