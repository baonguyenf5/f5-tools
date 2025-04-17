export type CloudflareDNSRecord = {
  id: string;
  name: string;
  type: string;
  content: string;
  proxied: boolean;
  ttl: number;
  comment?: string;
};

export type UserMapping = {
  id: number;
  user_email: string;
  a_name: string;
  created_at: string;
};
