import React, { useEffect, useState } from 'react'
import './style.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Search from 'components/Search/Search';
import markerImage from './image/marker.png';
import { MedicineStore } from 'types/interface';
import { PostMedicineStoreResponseDto } from 'apis/response/medicineStore';
import { PostMedicineRequestDto } from 'apis/request/medicineStore';
import proj4 from 'proj4';
import { ResponseDto } from 'apis/response';
import { postMedicineStoreRequest } from 'apis';
declare const kakao: any;


export default function Store() {
  const [startIndex, setStartIndex] = useState('0'); // 시작 인덱스 상태
  const [endIndex, setEndIndex] = useState('5'); // 종료 인덱스 상태
  const [medicineStore, setMedicineStore] = useState<MedicineStore[]>([]);
  const [locations, setLocations] = useState<[string, string, string][]>([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [mapContainers, setMapContainers] = useState<string[]>([]);
  const [transformedCoord, setTransformedCoord] = useState<[number, number][] | null>(null);
  const [nametransformedCoord, setNameTransformedCoord] = useState<Location[] | null>(null);
  const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
  const webMercator = '+proj=tmerc +lat_0=38 +lon_0=127 +k=0.9996 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs';
  const [coordinates, setCoordinates] = useState<{ X: number | null, Y: number | null }>({ X: null, Y: null });

  type Location = {
    name: string;
    coords: [number, number];
  };

  //슬라이드 효과
  useEffect(() => {
    AOS.init({duration: 2000});
  }, []);

const postMedicineStoreResponse = (responseBody: any) => {
  if (!responseBody || !Array.isArray(responseBody)) {
    console.log("responseBody가 null이거나 배열이 아닙니다.");
    return;
  }

  // responseBody 배열의 각 요소를 MedicineStore 객체로 변환
  const medicineStores: MedicineStore[] = responseBody.map((item: any) => ({
    MGTNO: item.MGTNO,
    BPLCNM: item.BPLCNM,
    DTLSTATENM: item.DTLSTATENM,
    TRDSTATENM: item.TRDSTATENM,
    RDNWHLADDR: item.RDNWHLADDR,
    SITEWHLADDR: item.SITEWHLADDR,
    X: item.X,
    Y: item.Y
  }));

  // 변환된 배열을 setMedicineStore 함수에 전달
  setMedicineStore(medicineStores);

  // 변환된 배열을 콘솔에 출력
  console.log("MedicineStore 배열:", medicineStores);
}

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
  setNameTransformedCoord(nameAndCoords);
  console.log("변환 후 좌표:", tempTransformedCoords);
  console.log("이름과 좌표:", nameAndCoords);
};

useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const requestBody = { X: latitude, Y: longitude };

      console.log("API 요청 좌표: ", requestBody);

      postMedicineStoreRequest(requestBody)
        .then((response) => {
          console.log("API 응답: ", response);
          if (response && Array.isArray(response)) {
            setMedicineStore(response);
            console.log("약국 데이터 설정: ", response);
          } else {
            console.error("API 응답이 유효하지 않습니다: ", response);
          }
        })
        .catch((error) => {
          console.error("API 호출 오류: ", error);
        });
    },
    (error) => {
      console.error("Geolocation error: ", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}, []);

useEffect(() => {
  if (medicineStore.length > 0) {
    const newMapContainers: string[] = medicineStore.map((_, index) => `map-container-${index}`);
    setMapContainers(newMapContainers);
  }
}, [medicineStore]);

useEffect(() => {
  if (mapContainers.length > 0) {
    mapContainers.forEach((containerId, index) => {
      const container = document.getElementById(containerId);
      const store = medicineStore[index];

      if (container && store) {
        const options = {
          center: new kakao.maps.LatLng(store.Y, store.X),
          level: 3
        };

        const mapInstance = new kakao.maps.Map(container, options);
        const storeMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(store.Y, store.X),
          image: new kakao.maps.MarkerImage(markerImage, new kakao.maps.Size(50, 50), {
            offset: new kakao.maps.Point(25, 50),
          }),
        });
        storeMarker.setMap(mapInstance);
        console.log("마커 설정 완료: ", store);
      } else {
        console.error("컨테이너 또는 약국 데이터가 유효하지 않습니다:", containerId, store);
      }
    });
  }
}, [mapContainers, medicineStore]);

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
        <div className='map-content-gap'>
      <div id="map">
      {mapContainers.map((containerId, index) => (
        <div key={containerId} id={containerId} className="map-container"></div>
      ))}
      </div>
      <div className="store-content">
      {medicineStore.map((store, index) => (
    <div key={index}>
      <div className='store-content-box'>
      <div className='store-content-title'>{store.BPLCNM}</div>
      <div className='store-content-address-title'>도로명주소</div>
      <div className='store-content-address'>{store.RDNWHLADDR}</div>
      <div className='store-content-address-title'>지번주소</div>
      <div className='store-content-address'>{store.SITEWHLADDR ? store.SITEWHLADDR : '지번주소가 없습니다'}</div>
    </div>
    </div>
  ))}
  </div>
      </div>
    </div>
    </div>
    </>
  )
}