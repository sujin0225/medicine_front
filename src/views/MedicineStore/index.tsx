import React, { useEffect, useState } from 'react'
import './style.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import MedicineStoreSearch from 'components/MedicineStoreSearch'
import markerImage from './image/marker.png';
import { MedicineStore } from 'types/interface';
import { postMedicineStoreRequest } from 'apis';
declare const kakao: any;

export default function Store() {
  const [medicineStore, setMedicineStore] = useState<MedicineStore[]>([]);
  const [mapContainers, setMapContainers] = useState<string[]>([]);

  //슬라이드 효과
  useEffect(() => {
    AOS.init({duration: 2000});
  }, []);

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
      <MedicineStoreSearch />
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