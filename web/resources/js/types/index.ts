export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  avatar_url?: string;
  totp_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: number;
  name: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  mailbox_count?: number;
}

export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  priority?: number;
  ttl: number;
}

export interface DNSRecordCheck {
  expected: string;
  found: string[];
  valid: boolean;
  error?: string;
}

export interface DNSCheckResult {
  mx: DNSRecordCheck;
  txt: DNSRecordCheck;
}

export interface Mailbox {
  id: number;
  slug: string;
  owner_id: number | null;
  domain_id: number | null;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  max_email_size_mb: number;
  max_attachment_size_mb: number;
  retention_days: number;
  owner?: User;
  domain?: Domain;
  stats?: MailboxStats;
}

export interface MailboxStats {
  email_count: number;
  last_email_at: string | null;
  webhook_count: number;
}

export interface Email {
  id: number;
  mailbox_id: number;
  message_id: string;
  from_address: string;
  to_address: string;
  subject: string;
  date: string | null;
  headers: Record<string, string>;
  text_body: string;
  html_body: string;
  raw_size: number;
  received_at: string;
  is_read: boolean;
  attachments: Attachment[];
  has_attachments: boolean;
}

export interface Attachment {
  id: number;
  email_id: number;
  filename: string;
  content_type: string;
  size: number;
  download_url?: string;
}

export interface Webhook {
  id: number;
  mailbox_id: number;
  name: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  payload_type: string;
  custom_payload?: string;
  hmac_secret?: string;
  timeout_sec: number;
  max_retries: number;
  include_body: boolean;
  include_attachments: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  rules: WebhookRule[];
  delivery_stats?: WebhookDeliveryStats;
}

export interface WebhookRule {
  id: number;
  webhook_id: number;
  rule_group: number;
  field: string;
  operator: string;
  value: string;
  header_name?: string;
}

export interface WebhookDelivery {
  id: number;
  webhook_id: number;
  email_id: number;
  attempt: number;
  status: 'pending' | 'retrying' | 'success' | 'failed';
  status_code: number | null;
  request_body?: string;
  response_body?: string;
  error_message?: string;
  duration_ms: number | null;
  created_at: string;
}

export interface WebhookDeliveryStats {
  total: number;
  success_count: number;
  failed_count: number;
  pending_count: number;
}

export interface Pagination {
  current_page: number;
  total: number;
  per_page: number;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TagWithUsage extends Tag {
  usage_count: number;
}

export interface PageProps {
  auth?: {
    user: User;
  };
  flash?: {
    success?: string;
    error?: string;
  };
  appName: string;
  appVersion: string;
  safeMode?: boolean;
  [key: string]: unknown;
}
