import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input } from '@/components/Input';
import { PageProps } from '@/types';
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
  error?: string;
  name?: string;
  color?: string;
}

export default function TagsCreate({ error, name: initialName, color: initialColor }: Props) {
  const { data, setData, post, processing } = useForm({
    name: initialName || '',
    color: initialColor || '#6366f1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/tags');
  };

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.BackLink as={Link} href="/tags">
            &larr; Back to Tags
          </S.BackLink>
          <S.Title>Create Tag</S.Title>
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
                  {processing ? 'Creating...' : 'Create Tag'}
                </Button>
              </S.FormActions>
            </S.Form>
          </S.FormCard>
        </Card>
      </S.Container>
    </AppLayout>
  );
}
