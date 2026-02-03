import { useState, useEffect } from 'react';
import DomainLayout from '@/layouts/DomainLayout';
import { Card, CardBody } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Domain, DNSRecord, DNSCheckResult, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  domain: Domain;
  allDomains: Domain[];
  dnsRecords: DNSRecord[];
}

export default function DomainsShow({ domain, allDomains, dnsRecords }: Props) {
  const smtpHost = `mail.${domain.name}`;
  const [activeTab, setActiveTab] = useState<'table' | 'text'>('table');
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [dnsResult, setDnsResult] = useState<DNSCheckResult | null>(null);
  const [isVerified, setIsVerified] = useState(domain.is_verified);
  const [publicIp, setPublicIp] = useState('<SERVER_PUBLIC_IP>');

  useEffect(() => {
    fetch('/api/public-ip')
      .then((res) => res.json())
      .then((data) => {
        if (data.ip) {
          setPublicIp(data.ip);
        }
      })
      .catch(console.error);
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const generateDNSText = () => {
    const domainParts = domain.name.split('.');
    const isSubdomain = domainParts.length > 2;
    const baseDomain = isSubdomain ? domainParts.slice(1).join('.') : domain.name;
    const subdomainPrefix = isSubdomain ? domainParts[0] : null;

    return dnsRecords
      .map((record) => {
        if (record.type === 'A') {
          // A record: "mail" or "mail.{subdomain}"
          const aName = isSubdomain ? `mail.${subdomainPrefix}` : 'mail';
          const aValue = record.value === 'X.X.X.X' ? publicIp : record.value;
          return `${aName.padEnd(16)}IN  A     ${aValue}`;
        }
        if (record.type === 'MX') {
          // MX: "{subdomain}" or "{domain}."
          const mxName = isSubdomain ? subdomainPrefix : `${domain.name}.`;
          const mxValue = isSubdomain ? `mail.${subdomainPrefix}.${baseDomain}.` : `mail.${domain.name}.`;
          return `${mxName!.padEnd(16)}IN  MX ${record.priority} ${mxValue}`;
        }
        // TXT records (SPF)
        // TODO: Add DMARC support later
        // if (record.name.startsWith('_dmarc.')) {
        //   const dmarcName = isSubdomain ? `_dmarc.${subdomainPrefix}` : `_dmarc.${domain.name}.`;
        //   return `${dmarcName.padEnd(16)}IN  TXT   "${record.value}"`;
        // }
        // SPF record
        const txtName = isSubdomain ? subdomainPrefix : `${domain.name}.`;
        return `${txtName!.padEnd(16)}IN  TXT   "${record.value}"`;
      })
      .join('\n');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateDNSText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const checkDNS = async () => {
    setChecking(true);
    try {
      const response = await fetch(`/domains/${domain.id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Inertia': 'false',
        },
      });
      const result = await response.json();
      setDnsResult(result);

      // Update verification badge if all checks passed
      if (result.mx?.valid && result.txt?.valid) {
        setIsVerified(true);
      }
    } catch (err) {
      console.error('Failed to verify DNS:', err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <DomainLayout domain={domain} allDomains={allDomains}>
      <S.PageTitle>DNS Setup</S.PageTitle>

      <Card>
        <CardBody>
        <S.InfoGrid>
          <S.InfoItem>
            <S.InfoLabel>Status</S.InfoLabel>
            <S.InfoValue>
              <Badge variant={domain.is_active ? 'success' : 'gray'}>
                {domain.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Verification</S.InfoLabel>
            <S.InfoValue>
              <Badge variant={isVerified ? 'success' : 'warning'}>
                {isVerified ? 'Verified' : 'Pending'}
              </Badge>
            </S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>SMTP Host</S.InfoLabel>
            <S.InfoValue>{smtpHost}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Created</S.InfoLabel>
            <S.InfoValue>{formatDate(domain.created_at)}</S.InfoValue>
          </S.InfoItem>
        </S.InfoGrid>

        <S.Section>
          <S.SectionTitle>DNS Configuration</S.SectionTitle>
          <S.SectionDescription>
            Add the following DNS records to your domain registrar to receive emails at {domain.name}.
          </S.SectionDescription>

          <S.TabsContainer>
            <S.Tabs>
              <S.Tab $active={activeTab === 'table'} onClick={() => setActiveTab('table')}>
                Table View
              </S.Tab>
              <S.Tab $active={activeTab === 'text'} onClick={() => setActiveTab('text')}>
                Zone File
              </S.Tab>
            </S.Tabs>
          </S.TabsContainer>

          {activeTab === 'table' && (
            <S.TableWrapper>
              <S.Table>
                <S.TableHead>
                  <tr>
                    <S.TableHeader>Type</S.TableHeader>
                    <S.TableHeader>Name</S.TableHeader>
                    <S.TableHeader>Value</S.TableHeader>
                    <S.TableHeader>Priority</S.TableHeader>
                    <S.TableHeader>TTL</S.TableHeader>
                  </tr>
                </S.TableHead>
                <S.TableBody>
                  {dnsRecords.map((record, index) => (
                    <S.TableRow key={index}>
                      <S.TableCell>
                        <Badge variant="info">{record.type}</Badge>
                      </S.TableCell>
                      <S.TableCell>{record.name}</S.TableCell>
                      <S.TableCell>
                        {record.value === 'X.X.X.X' ? publicIp : record.value}
                      </S.TableCell>
                      <S.TableCell>{record.priority ?? '-'}</S.TableCell>
                      <S.TableCell>{record.ttl}</S.TableCell>
                    </S.TableRow>
                  ))}
                </S.TableBody>
              </S.Table>
            </S.TableWrapper>
          )}

          {activeTab === 'text' && (
            <S.CodeBlock>
              <S.CopyButton onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy'}
              </S.CopyButton>
              <S.Code>{generateDNSText()}</S.Code>
            </S.CodeBlock>
          )}
        </S.Section>

        <S.VerificationSection>
          <S.VerificationHeader>
            <S.SectionTitle>DNS Verification</S.SectionTitle>
            <S.CheckButton onClick={checkDNS} disabled={checking}>
              {checking ? 'Checking...' : 'Check DNS Records'}
            </S.CheckButton>
          </S.VerificationHeader>
          <S.SectionDescription>
            Verify that your DNS records are configured correctly for receiving emails.
          </S.SectionDescription>

          {dnsResult && (
            <S.VerificationResults>
              <S.VerificationCard $valid={dnsResult.mx.valid}>
                <S.VerificationCardHeader>
                  <S.VerificationIcon $valid={dnsResult.mx.valid}>
                    {dnsResult.mx.valid ? '✓' : '✗'}
                  </S.VerificationIcon>
                  <S.VerificationTitle $valid={dnsResult.mx.valid}>
                    MX Record {dnsResult.mx.valid ? 'Configured' : 'Missing or Invalid'}
                  </S.VerificationTitle>
                </S.VerificationCardHeader>
                <S.VerificationDetail>
                  <S.DetailRow>
                    <S.DetailLabel>Expected:</S.DetailLabel>
                    <S.DetailValue>{dnsResult.mx.expected}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Found:</S.DetailLabel>
                    <S.DetailValue>
                      {dnsResult.mx.found.length > 0 ? dnsResult.mx.found.join(', ') : 'None'}
                    </S.DetailValue>
                  </S.DetailRow>
                  {dnsResult.mx.error && (
                    <S.ErrorMessage>{dnsResult.mx.error}</S.ErrorMessage>
                  )}
                </S.VerificationDetail>
              </S.VerificationCard>

              <S.VerificationCard $valid={dnsResult.txt.valid}>
                <S.VerificationCardHeader>
                  <S.VerificationIcon $valid={dnsResult.txt.valid}>
                    {dnsResult.txt.valid ? '✓' : '✗'}
                  </S.VerificationIcon>
                  <S.VerificationTitle $valid={dnsResult.txt.valid}>
                    SPF Record {dnsResult.txt.valid ? 'Configured' : 'Missing or Invalid'}
                  </S.VerificationTitle>
                </S.VerificationCardHeader>
                <S.VerificationDetail>
                  <S.DetailRow>
                    <S.DetailLabel>Expected:</S.DetailLabel>
                    <S.DetailValue>{dnsResult.txt.expected}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Found:</S.DetailLabel>
                    <S.DetailValue>
                      {dnsResult.txt.found.length > 0 ? dnsResult.txt.found.join(', ') : 'None'}
                    </S.DetailValue>
                  </S.DetailRow>
                  {dnsResult.txt.error && (
                    <S.ErrorMessage>{dnsResult.txt.error}</S.ErrorMessage>
                  )}
                </S.VerificationDetail>
              </S.VerificationCard>
            </S.VerificationResults>
          )}
        </S.VerificationSection>
        </CardBody>
      </Card>
    </DomainLayout>
  );
}
