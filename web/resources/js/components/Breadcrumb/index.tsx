import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import * as S from './styled';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  options?: { label: string; href: string }[];
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <S.Container>
      {items.map((item, index) => (
        <S.Item key={index}>
          {index > 0 && (
            <S.Separator>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </S.Separator>
          )}
          
          {item.options ? (
            <Dropdown item={item} />
          ) : item.href ? (
            <S.Link as={Link} href={item.href}>
              {item.label}
            </S.Link>
          ) : (
            <S.Current>{item.label}</S.Current>
          )}
        </S.Item>
      ))}
    </S.Container>
  );
}

function Dropdown({ item }: { item: BreadcrumbItem }) {
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

  return (
    <S.DropdownWrapper ref={containerRef}>
      <S.DropdownTrigger onClick={() => setIsOpen(!isOpen)}>
        {item.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </S.DropdownTrigger>
      
      {isOpen && item.options && (
        <S.DropdownMenu>
          {item.options.map((option, i) => (
            <S.DropdownItem key={i} as={Link} href={option.href} onClick={() => setIsOpen(false)}>
              {option.label}
            </S.DropdownItem>
          ))}
        </S.DropdownMenu>
      )}
    </S.DropdownWrapper>
  );
}
