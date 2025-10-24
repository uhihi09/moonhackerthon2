import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import MapView from '../common/MapView';
import { locationAPI } from '../../services/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import '../../styles/components.css';

const LocationHistory = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchLocationHistory();
  }, []);

  const fetchLocationHistory = async () => {
    try {
      const response = await locationAPI.getRecentLocations(1);
      setLocations(response.data.locations || []);
    } catch (error) {
      console.error('위치 기록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="location-history-container">
      <Header showSettings={true} showBack={false} />
      
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="page-title">최근 1일 간 이동경로</h1>
      </div>

      <main className="location-content">
        {/* 지도 */}
        <div className="map-section">
          {locations.length > 0 && (
            <MapView
              latitude={locations[locations.length - 1].latitude}
              longitude={locations[locations.length - 1].longitude}
              locations={locations}
              showPath={true}
              markerLabel="최신 위치"
              height="350px"
            />
          )}
        </div>

        {/* 위치 목록 */}
        <div className="location-list">
          <div className="list-header">
            <span className="header-col">좌표값</span>
            <span className="header-col time">시각</span>
          </div>
          
          {locations.map((location, index) => (
            <div key={index} className="location-item">
              <span className="item-number">{index + 1}</span>
              <div className="coordinate-wrapper">
                <span className="coordinate-text">
                  {location.latitude.toFixed(7)}, {location.longitude.toFixed(7)}
                </span>
                <button
                  className={`copy-button ${copiedIndex === index ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(
                    `${location.latitude.toFixed(7)}, ${location.longitude.toFixed(7)}`,
                    index
                  )}
                  title="좌표 복사"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.33333 10H2.66667C2.31305 10 1.97391 9.85952 1.72386 9.60947C1.47381 9.35943 1.33333 9.02029 1.33333 8.66667V2.66667C1.33333 2.31305 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31305 1.33333 2.66667 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60948 1.72386C9.85952 1.97391 10 2.31305 10 2.66667V3.33333" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <span className="time-text">
                {format(new Date(location.timestamp), 'HH:mm', { locale: ko })}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LocationHistory;