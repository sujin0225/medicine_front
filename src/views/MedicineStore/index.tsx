import React, { useEffect } from 'react'
import './style.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Search from 'components/Search/Search';
import markerImage from './image/marker.png';
declare const kakao: any;

export default function Store() {

  //슬라이드 효과
  useEffect(() => {
    AOS.init({duration: 2000});
  }, []);

  //카카오 맵
  useEffect(() => {
    const container = document.getElementById('map');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //위도, 경도를 사용자 위치에 맞게 세팅
        const { latitude, longitude } = position.coords;
        const options = {
          center: new kakao.maps.LatLng(latitude, longitude),
          level: 3
        };
        const map = new kakao.maps.Map(container, options);
        const usermarker = new kakao.maps.Marker({
          //위도 경도에 마커 띄우기
          position: new kakao.maps.LatLng(latitude, longitude),
          //마커 이미지 크기 설정
          image:new kakao.maps.MarkerImage(markerImage, new kakao.maps.Size(50, 50), {
            offset: new kakao.maps.Point(25, 50),
          })
        })
        //마커를 앱에 띄우기
        usermarker.setMap(map);
      }
    )
  }, []);
    
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