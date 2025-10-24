import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import styled from 'styled-components';

function SignupPage() {
  const navigate = useNavigate();
  
  // ✅ 수정: 서버 필드에 맞게 변경
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',           // ✅ 추가 (필수)
    phoneNumber: '',    // ✅ phone → phoneNumber
    address: '',        // ✅ 추가 (선택)
    deviceId: '',       // 선택
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // 유효성 검사
  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.name || !formData.phoneNumber) {
      setError('필수 항목을 모두 입력해주세요.');
      return false;
    }

    if (formData.username.length < 3) {
      setError('아이디는 3자 이상이어야 합니다.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // ✅ 수정: passwordConfirm 제외하고 서버에 전송
      const { passwordConfirm, ...signupData } = formData;
      
      // 빈 값 제거 (선택 필드)
      if (!signupData.address) delete signupData.address;
      if (!signupData.deviceId) delete signupData.deviceId;

      console.log('회원가입 요청 데이터:', signupData);

      const response = await authAPI.signup(signupData);
      
      console.log('회원가입 응답:', response.data);
      
      // 토큰 저장 (서버가 자동 로그인 처리)
      const token = response.data.data?.token || response.data.token;
      
      if (token) {
        localStorage.setItem('token', token);
        const user = response.data.data || response.data;
        localStorage.setItem('user', JSON.stringify(user));
        
        alert('회원가입이 완료되었습니다!');
        navigate('/');
      } else {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        navigate('/login');
      }
      
    } catch (err) {
      console.error('회원가입 에러:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError('이미 존재하는 아이디 또는 이메일입니다.');
      } else if (err.response?.status === 400) {
        setError('입력 정보를 확인해주세요.');
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <SignupBox>
        <Title>회원가입</Title>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>아이디 *</Label>
            <Input
              type="text"
              name="username"
              placeholder="아이디 (3자 이상)"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label>이메일 *</Label>
            <Input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          {/* ✅ 추가: 이름 필드 */}
          <InputGroup>
            <Label>이름 *</Label>
            <Input
              type="text"
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호 *</Label>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호 (6자 이상)"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호 확인 *</Label>
            <Input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.passwordConfirm}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          {/* ✅ 수정: phone → phoneNumber */}
          <InputGroup>
            <Label>전화번호 *</Label>
            <Input
              type="tel"
              name="phoneNumber"
              placeholder="010-1234-5678"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          {/* ✅ 추가: 주소 필드 (선택) */}
          <InputGroup>
            <Label>주소 (선택)</Label>
            <Input
              type="text"
              name="address"
              placeholder="주소"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label>기기 ID (선택)</Label>
            <Input
              type="text"
              name="deviceId"
              placeholder="IoT 기기 ID (선택 사항)"
              value={formData.deviceId}
              onChange={handleChange}
              disabled={isLoading}
            />
            <HelpText>IoT 기기와 연동할 경우 입력하세요</HelpText>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? '가입 중...' : '가입하기'}
          </Button>
        </Form>

        <Footer>
          <span>이미 계정이 있으신가요?</span>
          <LoginLink onClick={() => navigate('/login')}>
            로그인
          </LoginLink>
        </Footer>
      </SignupBox>
    </Container>
  );
}

export default SignupPage;

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const SignupBox = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
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
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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

const HelpText = styled.span`
  font-size: 12px;
  color: #888;
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

const LoginLink = styled.button`
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