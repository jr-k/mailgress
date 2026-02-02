import { useEffect, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import * as S from './styled';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, size = 'md', children }: ModalProps) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <S.Overlay onClick={onClose}>
      <S.Content $size={size} onClick={(e) => e.stopPropagation()}>
        {children}
      </S.Content>
    </S.Overlay>,
    document.body
  );
};

interface ModalHeaderProps {
  children: ReactNode;
  onClose?: () => void;
}

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => {
  return (
    <S.Header>
      <div>{children}</div>
      {onClose && (
        <S.CloseButton onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </S.CloseButton>
      )}
    </S.Header>
  );
};

export const ModalTitle = S.Title;
export const ModalDescription = S.Description;
export const ModalBody = S.Body;
export const ModalFooter = S.Footer;
export const ModalIcon = S.IconWrapper;
