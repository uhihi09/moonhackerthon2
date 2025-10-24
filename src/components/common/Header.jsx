import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components.css';

const Header = ({ showSettings = true, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-content">
        {showBack && (
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div className="logo">
          <span className="logo-text">땡!</span>
        </div>
        {showSettings && (
          <button className="settings-button" onClick={() => navigate('/settings')}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" stroke="#888" strokeWidth="2"/>
              <path d="M25.6 17.6L23.52 19.2C23.6 19.76 23.6 20.4 23.52 20.96L25.6 22.56C25.76 22.72 25.84 22.96 25.76 23.2L23.84 26.8C23.76 27.04 23.52 27.12 23.28 27.04L20.8 26.08C20.32 26.48 19.84 26.8 19.28 27.04L18.88 29.68C18.88 29.92 18.64 30.08 18.4 30.08H14.56C14.32 30.08 14.08 29.92 14.08 29.68L13.68 27.04C13.12 26.8 12.64 26.48 12.16 26.08L9.68 27.04C9.44 27.12 9.2 27.04 9.12 26.8L7.2 23.2C7.12 22.96 7.2 22.72 7.36 22.56L9.44 20.96C9.36 20.4 9.36 19.76 9.44 19.2L7.36 17.6C7.2 17.44 7.12 17.2 7.2 16.96L9.12 13.36C9.2 13.12 9.44 13.04 9.68 13.12L12.16 14.08C12.64 13.68 13.12 13.36 13.68 13.12L14.08 10.48C14.08 10.24 14.32 10.08 14.56 10.08H18.4C18.64 10.08 18.88 10.24 18.88 10.48L19.28 13.12C19.84 13.36 20.32 13.68 20.8 14.08L23.28 13.12C23.52 13.04 23.76 13.12 23.84 13.36L25.76 16.96C25.84 17.2 25.76 17.44 25.6 17.6Z" stroke="#888" strokeWidth="2"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;