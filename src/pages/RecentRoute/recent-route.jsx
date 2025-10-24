import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { locationAPI } from '../../services/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const RecentRoute = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [locationHistory, setLocationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocationHistory();
  }, []);

  const fetchLocationHistory = async () => {
    setLoading(true);
    
    // Mock 데이터 사용 (API 없이 바로 표시)
    const mockData = [
      {
        id: 1,
        coordinates: '35.0497094, 127.9929478',
        timestamp: '2024-10-25T13:03:00'
      },
      {
        id: 2,
        coordinates: '37.0324096, 127.9953599',
        timestamp: '2024-10-25T13:18:00'
      },
      {
        id: 3,
        coordinates: '39.0421594, 127.3525478',
        timestamp: '2024-10-25T13:33:00'
      },
      {
        id: 4,
        coordinates: '38.0532551, 127.5325432',
        timestamp: '2024-10-25T13:48:00'
      },
      {
        id: 5,
        coordinates: '37.4235553, 127.9924478',
        timestamp: '2024-10-25T14:03:00'
      }
    ];

    // 로딩 효과를 위한 짧은 딜레이
    setTimeout(() => {
      setLocationHistory(mockData);
      setLoading(false);
    }, 300);

    /* API 연동 시 아래 코드 사용
    try {
      const response = await locationAPI.getRecentLocations(1);
      
      if (response.data && response.data.locations) {
        setLocationHistory(response.data.locations);
      } else {
        setLocationHistory(mockData);
      }
    } catch (error) {
      console.error('이동경로 로드 실패:', error);
      setLocationHistory(mockData);
    } finally {
      setLoading(false);
    }
    */
  };

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm', { locale: ko });
    } catch (error) {
      return timestamp;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('좌표가 복사되었습니다.');
    }).catch(() => {
      alert('복사에 실패했습니다.');
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      {/* 헤더 - Home과 동일 */}
      <Header>
        <LogoImage src="../src/assets/symbol.svg" alt="핑!" onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }} />
        <LogoText>핑!</LogoText>
        <SettingsIcon onClick={() => navigate('/settings')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
              stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" 
              stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </SettingsIcon>
      </Header>

      <Content>
        {/* 뒤로가기 + 페이지 제목 */}
        <PageHeader>
          <BackButton onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          <PageTitle>최근 1일 간 이동경로 상세</PageTitle>
        </PageHeader>
        {/* 지도 영역 */}
        <MapCard>
          <MapContainer>
            <MapPlaceholder>
              <RoutePathSVG>
                <svg width="100%" height="100%" viewBox="0 0 300 250" preserveAspectRatio="none">
                  {/* 경로 라인 */}
                  <path
                    d="M 50,50 L 120,80 L 180,140 L 220,180 L 250,210"
                    stroke="#FF3B30"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </RoutePathSVG>
              <EndLocationPin>
                <PinDot />
                <PinLabel>최신 위치</PinLabel>
              </EndLocationPin>
            </MapPlaceholder>
          </MapContainer>
        </MapCard>

        {/* 좌표 테이블 */}
        <TableCard>
          <TableHeader>
            <TableHeaderCell width="10%">
              <HeaderText></HeaderText>
            </TableHeaderCell>
            <TableHeaderCell width="60%">
              <HeaderText>좌표값</HeaderText>
            </TableHeaderCell>
            <TableHeaderCell width="30%">
              <HeaderText>시각</HeaderText>
            </TableHeaderCell>
          </TableHeader>

          <TableBody>
            {locationHistory.map((location, index) => (
              <TableRow key={location.id || index}>
                <TableCell width="10%">
                  <IndexNumber>{index + 1}</IndexNumber>
                </TableCell>
                <TableCell width="60%">
                  <CoordinateWrapper>
                    <CoordinateText>{location.coordinates}</CoordinateText>
                    <CopyButton onClick={() => copyToClipboard(location.coordinates)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" 
                          stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.33333 10H2.66667C2.31304 10 1.97391 9.85952 1.72386 9.60947C1.47381 9.35943 1.33333 9.02029 1.33333 8.66667V2.66667C1.33333 2.31304 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31304 1.33333 2.66667 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60948 1.72386C9.85952 1.97391 10 2.31304 10 2.66667V3.33333" 
                          stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </CopyButton>
                  </CoordinateWrapper>
                </TableCell>
                <TableCell width="30%">
                  <TimeText>{formatTime(location.timestamp)}</TimeText>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableCard>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff8c00;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const LogoText = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #ff8c00;
  margin: 0;
  display: none;
`;

const SettingsIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.main`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -4px;
`;

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const MapCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #c8e6c9 0%, #e8f5e9 50%, #b2ebf2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapPlaceholder = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const RoutePathSVG = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const EndLocationPin = styled.div`
  position: absolute;
  bottom: 40px;
  right: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PinDot = styled.div`
  width: 16px;
  height: 16px;
  background-color: #FF3B30;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const PinLabel = styled.div`
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  margin-top: 8px;
  white-space: nowrap;
  font-weight: 500;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
`;

const TableHeaderCell = styled.div`
  width: ${props => props.width};
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.width === '10%' ? 'center' : 'flex-start'};
`;

const HeaderText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #495057;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.div`
  width: ${props => props.width};
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.width === '10%' ? 'center' : 'flex-start'};
`;

const IndexNumber = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #333;
`;

const CoordinateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const CoordinateText = styled.span`
  font-size: 14px;
  color: #333;
  font-family: 'Courier New', monospace;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TimeText = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #333;
`;

export default RecentRoute;