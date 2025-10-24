import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import MapView from '../common/MapView';
import { emergencyAPI } from '../../services/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import '../../styles/components.css';

const EmergencyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEmergencyDetail();
  }, [id]);

  const fetchEmergencyDetail = async () => {
    try {
      const response = await emergencyAPI.getRecordDetail(id);
      setEmergency(response.data);
    } catch (error) {
      console.error('긴급 기록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyCall = (type) => {
    const phoneNumber = type === 'police' ? '112' : '119';
    window.location.href = `tel:${phoneNumber}`;
  };

  const copyCoordinates = async () => {
    if (!emergency) return;
    
    const text = `${emergency.latitude}, ${emergency.longitude}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      '상': '#FF3B30',
      '중': '#FF9500',
      '하': '#34C759'
    };
    return colors[level] || '#888';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!emergency) {
    return (
      <div className="error-container">
        <p>긴급 기록을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/home')} className="btn-primary">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="emergency-detail-container">
      <Header showSettings={true} showBack={false} />
      
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="page-title">위급버튼 기록 상세</h1>
      </div>

      <main className="emergency-detail-content">
        {/* 지도 */}
        <div className="map-section">
          <MapView
            latitude={emergency.latitude}
            longitude={emergency.longitude}
            markerLabel="버튼 사용 위치"
            height="320px"
          />
        </div>

        {/* 상세 정보 */}
        <div className="detail-info-card">
          <div className="info-row">
            <span className="info-label">시각</span>
            <span className="info-value">
              {format(new Date(emergency.timestamp), 'yyyy. MM. dd.(E) HH:mm:ss', { locale: ko })}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">위치</span>
            <div className="location-value">
              <span>{emergency.address}</span>
              <span className="coordinates">
                ({emergency.latitude.toFixed(7)}, {emergency.longitude.toFixed(7)})
              </span>
              <button
                className={`copy-button-inline ${copied ? 'copied' : ''}`}
                onClick={copyCoordinates}
              >
                복사
              </button>
            </div>
          </div>

          <div className="info-row ai-summary">
            <span className="info-label">AI<br/>상황<br/>요약</span>
            <div className="info-value summary-text">
              {emergency.aiSummary || 
                "'살려주세요'라는 음성이 인식된 것으로 보아 납치, 협박 등의 위험에 처하신 것으로 보입니다. 신속한 경찰 신고가 필요합니다."}
            </div>
          </div>

          <div className="info-row">
            <span className="info-label">예상 위험도</span>
            <span 
              className="risk-level"
              style={{ color: getRiskLevelColor(emergency.riskLevel || '상') }}
            >
              {emergency.riskLevel || '상'}
            </span>
          </div>
        </div>

        {/* 긴급 신고 버튼 */}
        <div className="emergency-call-section">
          <button 
            className="emergency-button-large police"
            onClick={() => handleEmergencyCall('police')}
          >
            <div className="button-content">
              <div className="emergency-number-large">112</div>
              <div className="emergency-label-large">경찰 신고하기</div>
            </div>
          </button>
          
          <button 
            className="emergency-button-large fire"
            onClick={() => handleEmergencyCall('fire')}
          >
            <div className="button-content">
              <div className="emergency-number-large">119</div>
              <div className="emergency-label-large">소방/구급 신고하기</div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default EmergencyDetail;