import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import '../../styles/components.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    emergencyContacts: [{ name: '', phone: '', relation: '' }]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][field] = value;
    setFormData({
      ...formData,
      emergencyContacts: newContacts
    });
  };

  const addContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, { name: '', phone: '', relation: '' }]
    });
  };

  const removeContact = (index) => {
    const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      emergencyContacts: newContacts
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.emergencyContacts.some(c => !c.name || !c.phone)) {
      setError('긴급 연락처 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.register(formData);
      
      if (response.data.success) {
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="logo-large">
          <span className="logo-text-large">땡!</span>
        </div>
        <h1 className="auth-title">회원가입</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <div className="emergency-contacts-section">
            <label>긴급 연락처 (최소 1명)</label>
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="contact-group">
                <input
                  type="text"
                  placeholder="이름"
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="전화번호"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="관계 (예: 부모님, 친구)"
                  value={contact.relation}
                  onChange={(e) => handleContactChange(index, 'relation', e.target.value)}
                  required
                />
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => removeContact(index)}
                    className="btn-remove-contact"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addContact}
              className="btn-add-contact"
            >
              + 연락처 추가
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-footer">
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login" className="auth-link">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;