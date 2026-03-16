import { Experience } from '@/types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/supabase/database';

const TABLE = 'experience';

export const getExperience = async (): Promise<Experience[]> => {
  const data = await getCollection(TABLE, { order: { column: 'start_date', ascending: false } });
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    organization: item.company,
    description: item.description.join('\n'), // Firebase might have been a string, SQL uses array
    startDate: item.start_date,
    endDate: item.end_date,
    type: item.type || 'work', // Ensure type is handled
    createdAt: item.created_at
  }));
};

export const addExperience = async (data: Omit<Experience, 'id'>): Promise<string> => {
  const supabaseData = {
    title: data.title,
    company: data.organization,
    description: data.description.split('\n'),
    start_date: data.startDate,
    end_date: data.endDate,
    type: data.type
  };
  const result = await addDocument(TABLE, supabaseData);
  return result.id;
};

export const updateExperience = async (id: string, data: Partial<Experience>): Promise<void> => {
  const supabaseData: any = {};
  if (data.title !== undefined) supabaseData.title = data.title;
  if (data.organization !== undefined) supabaseData.company = data.organization;
  if (data.description !== undefined) supabaseData.description = data.description.split('\n');
  if (data.startDate !== undefined) supabaseData.start_date = data.startDate;
  if (data.endDate !== undefined) supabaseData.end_date = data.endDate;
  if (data.type !== undefined) supabaseData.type = data.type;

  await updateDocument(TABLE, id, supabaseData);
};

export const deleteExperience = (id: string): Promise<void> =>
  deleteDocument(TABLE, id);
