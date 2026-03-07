export interface Lead {
  id: string;
  place_id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  review_count: number;
  emails: string[];
  city: string;
  trade: string;
  grade: string;
  audit: {
    reason?: string;
    ssl?: boolean;
    mobile_friendly?: boolean;
    performance_score?: number;
    accessibility_score?: number;
    seo_score?: number;
  };
  reviews: { author: string; rating: number; text: string; time: string }[];
  outreach_status: 'not_sent' | 'sent' | 'opened' | 'replied' | 'won' | 'not_interested';
  activity_log: { date: string; action: string; note?: string }[];
  notes: string;
  preview_slug: string;
  last_contact_date: string | null;
}
