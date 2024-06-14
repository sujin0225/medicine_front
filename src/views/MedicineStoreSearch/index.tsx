import React, { useEffect, useState } from 'react'
import { MedicineStoreSearch } from 'types/interface';
import StoreSearch from 'components/MedicineStoreSearch'
import { getMedicineStoreSearchRequest } from 'apis'
import markerImage from './image/marker.png';
import { useParams } from 'react-router-dom';
import { GetMedicineStoreSearchResponseDto } from 'apis/response/medicineStore';
import { ResponseDto } from 'apis/response';
declare const kakao: any;

export default function StoreSearchView() {
const [mapContainers, setMapContainers] = useState<string[]>([]);
const [medicineStore, setMedicineStore] = useState<MedicineStoreSearch[]>([]);
//state: 검색어 path variable 상태
const { searchWord } = useParams();

useEffect(() => {
  getMedicineStoreSearchRequest(searchWord ?? '').then(getMedicineStoreSearchResponse);
}, [searchWord]);

//상비의약품 판매처 지역으로 검색
const getMedicineStoreSearchResponse = (responseBody: GetMedicineStoreSearchResponseDto | ResponseDto | null) => {
  console.log("API Response:", responseBody);
  
  if (responseBody && 'medicineStoreListItems' in responseBody) {
    const { medicineStoreListItems } = responseBody as GetMedicineStoreSearchResponseDto;
    if (medicineStoreListItems.length > 0) {
      setMedicineStore(medicineStoreListItems);
    } else {
      setMedicineStore([]);
    }
    console.log(medicineStoreListItems);
  } else {
    setMedicineStore([]);
    console.error("Unexpected response format:", responseBody);
  }
}

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
          center: new kakao.maps.LatLng(store.y, store.x),
          level: 3
        };

        const mapInstance = new kakao.maps.Map(container, options);
        const storeMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(store.y, store.x),
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
      <StoreSearch />
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
      <div className='store-content-title'>{store.bplcnm}</div>
      <div className='store-content-address-title'>도로명주소</div>
      <div className='store-content-address'>{store.rdnwhladdr}</div>
      <div className='store-content-address-title'>지번주소</div>
      <div className='store-content-address'>{store.sitewhladdr ? store.sitewhladdr : '지번주소가 없습니다'}</div>
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
