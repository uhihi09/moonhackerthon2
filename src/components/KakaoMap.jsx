import { useEffect, useRef } from 'react';
import styled from 'styled-components';

function KakaoMap({ 
  latitude = 35.0497094,  // 기본 위도
  longitude = 127.9929478, // 기본 경도
  level = 3,              // 지도 확대 레벨 (1~14)
  markers = [],           // 마커 배열
  polyline = [],          // 경로선 좌표 배열
  height = '300px',
  showCurrentLocation = true,
  onMapLoad = null
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('❌ Kakao Map API가 로드되지 않았습니다.');
      return;
    }

    // 지도 생성
    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: level
    };

    const map = new window.kakao.maps.Map(mapContainer.current, options);
    mapRef.current = map;

    // 현재 위치 마커 표시
    if (showCurrentLocation) {
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map
      });

      // 마커에 라벨 추가
      const content = `
        <div style="
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        ">
          현재 위치
        </div>
      `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
        yAnchor: 2.5
      });

      customOverlay.setMap(map);
    }

    // 추가 마커 표시
    if (markers && markers.length > 0) {
      markers.forEach((markerData, index) => {
        const position = new window.kakao.maps.LatLng(
          markerData.latitude,
          markerData.longitude
        );

        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map
        });

        // 마커 클릭 이벤트
        if (markerData.onClick) {
          window.kakao.maps.event.addListener(marker, 'click', () => {
            markerData.onClick(markerData, index);
          });
        }

        // 인포윈도우 (말풍선)
        if (markerData.title) {
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${markerData.title}</div>`
          });

          window.kakao.maps.event.addListener(marker, 'mouseover', () => {
            infowindow.open(map, marker);
          });

          window.kakao.maps.event.addListener(marker, 'mouseout', () => {
            infowindow.close();
          });
        }
      });
    }

    // 경로선 그리기
    if (polyline && polyline.length > 1) {
      const linePath = polyline.map(
        coord => new window.kakao.maps.LatLng(coord.latitude, coord.longitude)
      );

      const line = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 4,
        strokeColor: '#FF3B30',
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
      });

      line.setMap(map);

      // 경로에 맞게 지도 범위 조정
      const bounds = new window.kakao.maps.LatLngBounds();
      linePath.forEach(point => bounds.extend(point));
      map.setBounds(bounds);
    }

    // 지도 로드 완료 콜백
    if (onMapLoad) {
      onMapLoad(map);
    }

    console.log('✅ Kakao Map 로드 완료');
  }, [latitude, longitude, level, markers, polyline, showCurrentLocation]);

  return <MapContainer ref={mapContainer} height={height} />;
}

export default KakaoMap;

const MapContainer = styled.div`
  width: 100%;
  height: ${props => props.height};
  border-radius: 8px;
`;