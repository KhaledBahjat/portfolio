import { Settings } from '@/types';
import { getDocument, updateDocument } from '@/lib/supabase/database';
import { uploadFile } from '@/lib/supabase/storage';

const TABLE = 'settings';
const DOC_ID = 'main';

export const getSettings = async (): Promise<Settings | null> => {
  try {
    const item = await getDocument(TABLE, DOC_ID);
    if (!item) return null;

    return {
      siteTitle: item.site_title || '',
      developerName: item.developer_name || '',
      title: item.title || '',
      tagline: item.tagline || '',
      bio: item.bio || '',
      profileImage: item.profile_image || '',
      socialLinks: item.social_links || { github: '', linkedin: '', codeforces: '', email: '' },
      experienceYears: item.experience_years || 0,
      projectsCompleted: item.projects_completed || 0,
      technologiesCount: item.technologies_count || 0,
      updatedAt: item.updated_at
    };
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (data: Partial<Settings>): Promise<void> => {
  const supabaseData: any = {};
  if (data.siteTitle !== undefined) supabaseData.site_title = data.siteTitle;
  if (data.developerName !== undefined) supabaseData.developer_name = data.developerName;
  if (data.title !== undefined) supabaseData.title = data.title;
  if (data.tagline !== undefined) supabaseData.tagline = data.tagline;
  if (data.bio !== undefined) supabaseData.bio = data.bio;
  if (data.profileImage !== undefined) supabaseData.profile_image = data.profileImage;
  if (data.socialLinks !== undefined) supabaseData.social_links = data.socialLinks;
  if (data.experienceYears !== undefined) supabaseData.experience_years = data.experienceYears;
  if (data.projectsCompleted !== undefined) supabaseData.projects_completed = data.projectsCompleted;
  if (data.technologiesCount !== undefined) supabaseData.technologies_count = data.technologiesCount;

  await updateDocument(TABLE, DOC_ID, supabaseData);
};

export const uploadProfileImage = (file: File): Promise<string> =>
  uploadFile(`profile`, file);
