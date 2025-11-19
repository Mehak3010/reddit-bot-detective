export interface UserData {
  author_name: string;
  author_id: string;
  created_utc: number;
  comment_karma: number;
  link_karma: number;
  total_karma: number;
  has_verified_email: boolean;
  is_mod: boolean;
  is_gold: boolean;
  account_age_days: number;
  karma_per_day: number;
  comment_ratio: number;
  link_ratio: number;
  username_length: number;
  username_has_number: boolean;
  submission_count: number;
  comment_count: number;
  subreddit_diversity: number;
  avg_comment_length: number;
  std_comment_length: number;
  avg_time_between_comments: number;
}

export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

export const parseUserFromCSV = (line: string): UserData | null => {
  const fields = parseCSVLine(line);
  
  if (fields.length < 20) return null;

  try {
    return {
      author_name: fields[0],
      author_id: fields[1],
      created_utc: parseFloat(fields[2]) || 0,
      comment_karma: parseInt(fields[3]) || 0,
      link_karma: parseInt(fields[4]) || 0,
      total_karma: parseInt(fields[5]) || 0,
      has_verified_email: fields[8] === 'True',
      is_mod: fields[9] === 'True',
      is_gold: fields[10] === 'True',
      account_age_days: parseInt(fields[17]) || 0,
      karma_per_day: parseFloat(fields[18]) || 0,
      comment_ratio: parseFloat(fields[19]) || 0,
      link_ratio: parseFloat(fields[20]) || 0,
      username_length: parseInt(fields[22]) || 0,
      username_has_number: fields[23] === '1' || fields[23] === 'True',
      submission_count: parseFloat(fields[25]) || 0,
      comment_count: parseFloat(fields[26]) || 0,
      subreddit_diversity: parseFloat(fields[27]) || 0,
      avg_comment_length: parseFloat(fields[28]) || 0,
      std_comment_length: parseFloat(fields[29]) || 0,
      avg_time_between_comments: parseFloat(fields[30]) || 0,
    };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

import { getUsers } from "@/utils/api";

type DBUser = {
  id?: number;
  username: string;
  verified?: boolean;
  source?: string;
  meta?: Record<string, unknown> | string | null;
};

const toBool = (v: unknown) => v === true || v === 'True' || v === '1';
const toNum = (v: unknown) => {
  const n = typeof v === 'string' ? parseFloat(v as string) : Number(v);
  return isNaN(n) ? 0 : n;
};

const dbUserToUserData = (u: DBUser): UserData | null => {
  try {
    const meta = typeof u.meta === 'string' ? JSON.parse(u.meta || '{}') : (u.meta || {});
    return {
      author_name: u.username || meta.author_name || '',
      author_id: String(meta.author_id || ''),
      created_utc: toNum(meta.created_utc),
      comment_karma: toNum(meta.comment_karma),
      link_karma: toNum(meta.link_karma),
      total_karma: toNum(meta.total_karma),
      has_verified_email: toBool(meta.has_verified_email),
      is_mod: toBool(meta.is_mod),
      is_gold: toBool(meta.is_gold),
      account_age_days: toNum(meta.account_age_days),
      karma_per_day: toNum(meta.karma_per_day),
      comment_ratio: toNum(meta.comment_ratio),
      link_ratio: toNum(meta.link_ratio),
      username_length: toNum(meta.username_length),
      username_has_number: toBool(meta.username_has_number),
      submission_count: toNum(meta.submission_count),
      comment_count: toNum(meta.comment_count),
      subreddit_diversity: toNum(meta.subreddit_diversity),
      avg_comment_length: toNum(meta.avg_comment_length),
      std_comment_length: toNum(meta.std_comment_length),
      avg_time_between_comments: toNum(meta.avg_time_between_comments),
    };
  } catch (e) {
    return null;
  }
};

export const searchUserInCSV = async (username: string, dataset?: string): Promise<UserData | null> => {
  // Try DB via API first
  try {
    const data = await getUsers(dataset);
    const users: DBUser[] = Array.isArray((data as any)?.users) ? (data as any).users : [];
    const match = users.find((u: DBUser) => (u.username || '').toLowerCase() === username.toLowerCase());
    if (match) return dbUserToUserData(match);
  } catch (e) {
    // fall through to CSV
  }
  try {
    const response = await fetch('/data/users_parameters_phase1.csv');
    const text = await response.text();
    const lines = text.split('\n');
    for (let i = 1; i < lines.length; i++) {
      const user = parseUserFromCSV(lines[i]);
      if (user && user.author_name.toLowerCase() === username.toLowerCase()) {
        return user;
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading CSV:', error);
    return null;
  }
};

export const getUsersFromCSV = async (dataset?: string): Promise<UserData[]> => {
  // Prefer DB via API
  try {
    const data = await getUsers(dataset);
    const users: DBUser[] = Array.isArray((data as any)?.users) ? (data as any).users : [];
    const mapped = users.map(dbUserToUserData).filter((u): u is UserData => !!u);
    if (mapped.length) return mapped;
  } catch (e) {
    // ignore and try CSV
  }
  try {
    const response = await fetch('/data/users_parameters_phase1.csv');
    const text = await response.text();
    const lines = text.split('\n');
    const users: UserData[] = [];
    for (let i = 1; i < lines.length; i++) {
      const user = parseUserFromCSV(lines[i]);
      if (user) users.push(user);
    }
    return users;
  } catch (error) {
    console.error('Error reading CSV:', error);
    return [];
  }
};
