import React, { useEffect, useRef } from 'react';

const MapView = ({ 
  latitude, 
  longitude, 
  locations = [], 
  showPath = false,
  markerLabel = '현재 위치',
  height = '300px' 
}) => {
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);

  useEffect(() => {
    // 카카오맵 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_KEY&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3
        };

        const map = new window.kakao.maps.Map(container, options);
        kakaoMapRef.current = map;

        // 마커 표시
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);

        // 커스텀 오버레이 (라벨)
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: `<div style="padding:5px 10px;background:#333;color:#fff;border-radius:15px;font-size:12px;white-space:nowrap;">${markerLabel}</div>`,
          yAnchor: 2.5
        });
        customOverlay.setMap(map);

        // 경로 표시
        if (showPath && locations.length > 1) {
          const linePath = locations.map(loc => 
            new window.kakao.maps.LatLng(loc.latitude, loc.longitude)
          );

          const polyline = new window.kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeStyle: 'solid'
          });

          polyline.setMap(map);

          // 시작점 마커
          const startMarker = new window.kakao.maps.Marker({
            position: linePath[0],
            image: new window.kakao.maps.MarkerImage(
              'data:image/svg+xml;base64,...', // 커스텀 시작점 아이콘
              new window.kakao.maps.Size(30, 30)
            )
          });
          startMarker.setMap(map);

          // 끝점 마커
          const endMarker = new window.kakao.maps.Marker({
            position: linePath[linePath.length - 1]
          });
          endMarker.setMap(map);
        }
      });
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [latitude, longitude, locations, showPath, markerLabel]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: height,
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    />
  );
};

export default MapView;