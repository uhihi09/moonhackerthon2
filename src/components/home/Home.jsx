import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import MapView from '../common/MapView';
import { locationAPI, emergencyAPI } from '../../services/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import '../../styles/components.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recentEmergency, setRecentEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [locationRes, emergencyRes] = await Promise.all([
        locationAPI.getCurrentLocation(),
        emergencyAPI.getRecords()
      ]);

      setCurrentLocation(locationRes.data);
      if (emergencyRes.data.records && emergencyRes.data.records.length > 0) {
        setRecentEmergency(emergencyRes.data.records[0]);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyCall = (type) => {
    const phoneNumber = type === 'police' ? '112' : '119';
    window.location.href = `tel:${phoneNumber}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header />
      
      <main className="home-content">
        {/* 지도 카드 */}
        <div className="map-card">
          {currentLocation && (
            <MapView
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              markerLabel={`${user.name || '배준하'} 님`}
              height="320px"
            />
          )}
          <div className="map-info">
            <span className="location-text">{currentLocation?.address || '경상남도 사천시 광포길'}</span>
            <span className="time-text">
              {currentLocation?.timestamp 
                ? format(new Date(currentLocation.timestamp), 'yy.MM.dd. HH:mm 기준', { locale: ko })
                : '10.24. 14:52 기준'}
            </span>
          </div>
        </div>

        {/* 최근 이동경로 버튼 */}
        <button 
          className="location-history-button"
          onClick={() => navigate('/location-history')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M17 8L21 12M21 12L17 16M21 12H9M9 4H7C5.89543 4 5 4.89543 5 6V18C5 19.1046 5.89543 20 7 20H9" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>최근 이동경로 확인하기</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 위급버튼 기록 */}
        <div className="emergency-record-card">
          <h2 className="card-title">위급버튼 기록</h2>
          {recentEmergency ? (
            <div 
              className="emergency-item"
              onClick={() => navigate(`/emergency/${recentEmergency.id}`)}
            >
              <div className="emergency-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 10V16M16 22H16.01M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" 
                    stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="emergency-content">
                <span className="emergency-date">
                  {recentEmergency.timestamp 
                    ? format(new Date(recentEmergency.timestamp), 'M월 d일(E) a h:mm', { locale: ko })
                    : '10월 24일(금) 오후 1:31'}
                </span>
              </div>
              <button className="detail-button">
                자세히보기 &gt;
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <p>위급버튼 기록이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 긴급신고 버튼 */}
        <div className="emergency-call-card">
          <h2 className="card-title">긴급신고</h2>
          <div className="emergency-buttons">
            <button 
              className="emergency-button police"
              onClick={() => handleEmergencyCall('police')}
            >
              <div className="emergency-number">112</div>
              <div className="emergency-label">경찰관서에 신고하기</div>
            </button>
            <button 
              className="emergency-button fire"
              onClick={() => handleEmergencyCall('fire')}
            >
              <div className="emergency-number">119</div>
              <div className="emergency-label">소방관서에 신고하기</div>
            </button>
          </div>
        </div>

        <footer className="app-footer">
          <p>2025 Team 구지트리오</p>
        </footer>
      </main>
    </div>
  );
};

export default Home;