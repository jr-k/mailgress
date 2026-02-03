import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import { Tag, PageProps } from '@/types';
import * as S from './styled';

const COLOR_PRESETS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#3b82f6', // Blue
  '#6b7280', // Gray
];

interface Props extends PageProps {
  tag: Tag;
  error?: string;
}

export default function TagsEdit({ tag, error }: Props) {
  const { showToast } = useToast();
  const { data, setData, put, processing } = useForm({
    name: tag.name,
    color: tag.color,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/tags/${tag.id}`, {
      onSuccess: () => showToast('Changes saved'),
    });
  };

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.BackLink as={Link} href="/tags">
            &larr; Back to Tags
          </S.BackLink>
          <S.Title>Edit Tag</S.Title>
        </S.Header>

        {error && <Alert variant="error">{error}</Alert>}

        <Card>
          <S.FormCard>
            <S.Form onSubmit={handleSubmit}>
              <FormGroup label="Name" htmlFor="name">
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., Production, Development, Important"
                  required
                />
              </FormGroup>

              <FormGroup label="Color" htmlFor="color">
                <S.ColorPreview>
                  <S.ColorSwatch $color={data.color} />
                  <Input
                    id="color"
                    type="text"
                    value={data.color}
                    onChange={(e) => setData('color', e.target.value)}
                    placeholder="#6366f1"
                    style={{ width: '120px' }}
                  />
                </S.ColorPreview>
                <S.ColorPresets>
                  {COLOR_PRESETS.map((color) => (
                    <S.ColorPreset
                      key={color}
                      type="button"
                      $color={color}
                      $selected={data.color === color}
                      onClick={() => setData('color', color)}
                    />
                  ))}
                </S.ColorPresets>
              </FormGroup>

              <S.FormActions>
                <LinkButton href="/tags" variant="secondary">
                  Cancel
                </LinkButton>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </S.FormActions>
            </S.Form>
          </S.FormCard>
        </Card>
      </S.Container>
    </AppLayout>
  );
}
