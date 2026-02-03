import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DomainLayout from '@/layouts/DomainLayout';
import { Card } from '@/components/Card';
import { FormGroup, Input, Checkbox, Label } from '@/components/Input';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { TagSelector } from '@/components/TagSelector';
import { Domain, Tag, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  domain: Domain;
  allDomains: Domain[];
  allTags: Tag[];
  domainTags: Tag[];
  error?: string;
}

export default function DomainsEdit({ domain, allDomains, allTags, domainTags, error }: Props) {
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(domainTags.map((t) => t.id));
  const [tagsSaving, setTagsSaving] = useState(false);

  const { data, setData, put, processing } = useForm({
    name: domain.name,
    is_verified: domain.is_verified,
    is_active: domain.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save tags first
    setTagsSaving(true);
    try {
      await fetch(`/domains/${domain.id}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_ids: selectedTagIds }),
      });
    } finally {
      setTagsSaving(false);
    }

    put(`/domains/${domain.id}`, {
      preserveScroll: true,
    });
  };

  const selectedTags = allTags.filter((t) => selectedTagIds.includes(t.id));

  return (
    <DomainLayout domain={domain} allDomains={allDomains}>
      <S.PageTitle>Settings</S.PageTitle>

      {error && <Alert variant="error">{error}</Alert>}

      <Card>
          <S.FormCard>
            <S.Form onSubmit={handleSubmit}>
              <FormGroup label="Domain Name" htmlFor="name">
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="example.com"
                  required
                />
              </FormGroup>

              <div>
                <Label>Tags</Label>
                <S.TagsWrapper>
                  <TagSelector
                    allTags={allTags}
                    selectedTags={selectedTags}
                    onChange={setSelectedTagIds}
                    disabled={processing || tagsSaving}
                  />
                </S.TagsWrapper>
              </div>

              <div>
                <S.CheckboxWrapper>
                  <Checkbox
                    id="is_verified"
                    type="checkbox"
                    checked={data.is_verified}
                    onChange={(e) => setData('is_verified', e.target.checked)}
                  />
                  <S.CheckboxText>Domain is verified</S.CheckboxText>
                </S.CheckboxWrapper>
                <S.HelpText>
                  Mark as verified once you've confirmed the DNS records are configured correctly.
                </S.HelpText>
              </div>

              <div>
                <S.CheckboxWrapper>
                  <Checkbox
                    id="is_active"
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                  />
                  <S.CheckboxText>Domain is active</S.CheckboxText>
                </S.CheckboxWrapper>
                <S.HelpText>
                  Inactive domains will not receive emails.
                </S.HelpText>
              </div>

              <S.FormActions>
                <Button type="submit" disabled={processing || tagsSaving}>
                  {processing || tagsSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </S.FormActions>
            </S.Form>
          </S.FormCard>
        </Card>
    </DomainLayout>
  );
}
