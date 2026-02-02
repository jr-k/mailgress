import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import * as S from './styled';

interface AvatarUploadProps {
  userId: number;
  currentAvatarUrl?: string;
  email: string;
  onAvatarChange?: (newUrl: string | null) => void;
}

export function AvatarUpload({ userId, currentAvatarUrl, email, onAvatarChange }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    if (name.length >= 2) {
      return name.substring(0, 2);
    }
    return name.charAt(0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, GIF, and WebP images are allowed');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload avatar');
      }

      setAvatarUrl(result.avatar_url);
      onAvatarChange?.(result.avatar_url);
      // Reload to update header avatar
      router.reload({ only: ['auth'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    setError(null);
    setUploading(true);

    try {
      const response = await fetch(`/users/${userId}/avatar`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to remove avatar');
      }

      setAvatarUrl(undefined);
      onAvatarChange?.(null);
      // Reload to update header avatar
      router.reload({ only: ['auth'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <S.Container>
      <S.AvatarPreview>
        {avatarUrl ? (
          <S.PreviewImage src={avatarUrl} alt={email} />
        ) : (
          <S.PreviewFallback>{getInitials(email)}</S.PreviewFallback>
        )}
      </S.AvatarPreview>
      <S.Actions>
        <S.UploadLabel>
          {uploading ? 'Uploading...' : 'Change Avatar'}
          <S.HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </S.UploadLabel>
        {avatarUrl && (
          <S.RemoveButton onClick={handleRemove} disabled={uploading}>
            Remove
          </S.RemoveButton>
        )}
        <S.HelpText>JPG, PNG, GIF or WebP. Max 2MB.</S.HelpText>
        {error && <S.ErrorText>{error}</S.ErrorText>}
      </S.Actions>
    </S.Container>
  );
}
