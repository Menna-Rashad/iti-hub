export interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'internship';
  job_state: 'remote' | 'on-site' | 'hybrid';
  description: string;
  requirements: string;
  salary_range?: string;
  apply_link: string;
  created_at: string;
  user_id: number;
  votes_count: number;
  user_vote: 'upvote' | 'downvote' | null;
} 