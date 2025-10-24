import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import styled from 'styled-components';

function LoginPage() {
  const navigate = useNavigate();
  
  // 폼 입력값 상태 관리
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  
  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 에러 메시지 제거
  };

  // 로그인 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.usernameOrEmail || !formData.password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

try {
  const response = await authAPI.login(formData);
  
  console.log('로그인 응답:', response.data);
  
  // ✅ 수정: 응답 구조에 맞게 토큰과 사용자 정보 추출
  const responseData = response.data.data || response.data;
  const token = responseData.token;
  const user = {
    id: responseData.id,
    username: responseData.username,
    email: responseData.email,
    name: responseData.name,
    phoneNumber: responseData.phoneNumber,
    deviceId: responseData.deviceId
  };
  
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // ✅ 제대로 저장
    
    console.log('✅ 저장된 사용자:', user);
    
    alert('로그인 성공!');
    navigate('/');
  } else {
    setError('로그인에 실패했습니다.');
  }
} catch (err) {
      console.error('로그인 에러:', err);
      
      // 에러 메시지 처리
      if (err.response?.status === 401) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>로그인</Title>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>아이디 또는 이메일</Label>
            <Input
              type="text"
              name="usernameOrEmail"
              placeholder="아이디 또는 이메일을 입력하세요"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>

        <Footer>
          <span>계정이 없으신가요?</span>
          <SignupLink onClick={() => navigate('/signup')}>
            회원가입
          </SignupLink>
        </Footer>
      </LoginBox>
    </Container>
  );
}

export default LoginPage;

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const LoginBox = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fcc;
`;

const Footer = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;

  span {
    margin-right: 8px;
  }
`;

const SignupLink = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #764ba2;
  }
`;