import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { PageProps } from '@/types';
import * as S from './styled';

interface BuildInfo {
  version: string;
  author: string;
  email: string;
  website: string;
  license: string;
  copyright: string;
  description: string;
  features: string[];
  commit: string;
  date: string;
}

interface Props extends PageProps {
  buildInfo: BuildInfo;
}

export default function About({ buildInfo }: Props) {
  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.LogoContainer>
            <img src="/img/mailgress-icon.png" alt="Mailgress" width="80" height="80" />
          </S.LogoContainer>
          <S.Title>Mailgress</S.Title>
          <S.Version>Version {buildInfo.version}</S.Version>
          {buildInfo.commit !== 'none' && (
            <S.Commit>Commit: {buildInfo.commit.substring(0, 7)}</S.Commit>
          )}
          {buildInfo.date !== 'unknown' && (
            <S.BuildDate>Built: {buildInfo.date}</S.BuildDate>
          )}
        </S.Header>

        <Card>
          <S.Section>
            <S.SectionTitle>Description</S.SectionTitle>
            <S.Description>{buildInfo.description}</S.Description>
          </S.Section>
        </Card>

        <Card>
          <S.Section>
            <S.SectionTitle>Features</S.SectionTitle>
            <S.FeatureList>
              {buildInfo.features.map((feature, index) => (
                <S.FeatureItem key={index}>
                  <S.CheckIcon>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </S.CheckIcon>
                  {feature}
                </S.FeatureItem>
              ))}
            </S.FeatureList>
          </S.Section>
        </Card>

        <Card>
          <S.Section>
            <S.SectionTitle>Links</S.SectionTitle>
            <S.LinkList>
              <S.LinkItem>
                <S.LinkLabel>GitHub</S.LinkLabel>
                <S.ExternalLink href={buildInfo.website} target="_blank" rel="noopener noreferrer">
                  {buildInfo.website}
                  <S.ExternalIcon>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M10.5 7.5V11.5C10.5 12.0523 10.0523 12.5 9.5 12.5H2.5C1.94772 12.5 1.5 12.0523 1.5 11.5V4.5C1.5 3.94772 1.94772 3.5 2.5 3.5H6.5M8.5 1.5H12.5M12.5 1.5V5.5M12.5 1.5L5.5 8.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </S.ExternalIcon>
                </S.ExternalLink>
              </S.LinkItem>
            </S.LinkList>
          </S.Section>
        </Card>

        <Card>
          <S.Section>
            <S.SectionTitle>Author</S.SectionTitle>
            <S.InfoGrid>
              <S.InfoRow>
                <S.InfoLabel>Name</S.InfoLabel>
                <S.InfoValue>{buildInfo.author}</S.InfoValue>
              </S.InfoRow>
              <S.InfoRow>
                <S.InfoLabel>Email</S.InfoLabel>
                <S.InfoValue>
                  <a href={`mailto:${buildInfo.email}`}>{buildInfo.email}</a>
                </S.InfoValue>
              </S.InfoRow>
            </S.InfoGrid>
          </S.Section>
        </Card>

        <S.Footer>
          <S.Copyright>{buildInfo.copyright}</S.Copyright>
          <S.License>
            <a rel='noopener' target='_blank' href='https://raw.githubusercontent.com/jr-k/mailgress/refs/heads/master/LICENSE.md'>
              {buildInfo.license} License
            </a>
          </S.License>
        </S.Footer>
      </S.Container>
    </AppLayout>
  );
}
