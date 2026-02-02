import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button, LinkButton } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  error?: string;
  name?: string;
}

export default function DomainsCreate({ error, name }: Props) {
  const { data, setData, post, processing } = useForm({
    name: name || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/domains');
  };

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.Title>Add Domain</S.Title>
        </S.Header>

        <Card>
          <S.CardContent>
            {error && <Alert variant="error">{error}</Alert>}

            <S.Form onSubmit={handleSubmit}>
          <S.FormGroup>
            <S.Label htmlFor="name">Domain Name</S.Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="example.com"
              required
            />
            <S.HelpText>
              Enter your domain name (e.g., example.com). After adding, you'll need to configure DNS records.
            </S.HelpText>
          </S.FormGroup>

          <S.ButtonGroup>
            <Button type="submit" disabled={processing}>
              {processing ? 'Adding...' : 'Add Domain'}
            </Button>
            <LinkButton href="/domains" variant="secondary">
              Cancel
            </LinkButton>
            </S.ButtonGroup>
            </S.Form>
          </S.CardContent>
        </Card>
      </S.Container>
    </AppLayout>
  );
}
