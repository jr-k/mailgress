import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import * as S from './styled';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const ThemeSwitcher = () => {
  const { mode, setMode, resolvedMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentIcon = () => {
    if (mode === 'system') return <SystemIcon />;
    return resolvedMode === 'dark' ? <MoonIcon /> : <SunIcon />;
  };

  const getLabel = () => {
    switch (mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  };

  const handleSelect = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    setIsOpen(false);
  };

  return (
    <S.Container ref={containerRef}>
      <S.Button onClick={() => setIsOpen(!isOpen)} aria-label="Change theme">
        {getCurrentIcon()}
        <span>{getLabel()}</span>
      </S.Button>

      {isOpen && (
        <S.Dropdown>
          <S.Option $active={mode === 'light'} onClick={() => handleSelect('light')}>
            <SunIcon />
            Light
          </S.Option>
          <S.Option $active={mode === 'dark'} onClick={() => handleSelect('dark')}>
            <MoonIcon />
            Dark
          </S.Option>
          <S.Option $active={mode === 'system'} onClick={() => handleSelect('system')}>
            <SystemIcon />
            System
          </S.Option>
        </S.Dropdown>
      )}
    </S.Container>
  );
};
