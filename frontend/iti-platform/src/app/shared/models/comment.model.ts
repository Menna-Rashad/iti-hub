export interface Comment {
  id: number;
  content: string;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  commentable_type: string;
  commentable_id: number;
  created_at: string;
  updated_at: string;
} 