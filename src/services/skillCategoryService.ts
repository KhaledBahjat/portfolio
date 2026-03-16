import { SkillCategory } from '@/types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/supabase/database';

const TABLE = 'skill_categories';

export const getSkillCategories = async (): Promise<SkillCategory[]> => {
  const data = await getCollection(TABLE, { 
    order: { column: 'order_index', ascending: true } 
  });
  
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
    description: item.description,
    orderIndex: item.order_index,
    createdAt: item.created_at,
  }));
};

export const addSkillCategory = async (data: Omit<SkillCategory, 'id'>): Promise<string> => {
  const supabaseData = {
    name: data.name,
    icon: data.icon,
    description: data.description,
    order_index: data.orderIndex,
  };
  const result = await addDocument(TABLE, supabaseData);
  return result.id;
};

export const updateSkillCategory = async (id: string, data: Partial<SkillCategory>): Promise<void> => {
  const supabaseData: any = {};
  if (data.name !== undefined) supabaseData.name = data.name;
  if (data.icon !== undefined) supabaseData.icon = data.icon;
  if (data.description !== undefined) supabaseData.description = data.description;
  if (data.orderIndex !== undefined) supabaseData.order_index = data.orderIndex;

  await updateDocument(TABLE, id, supabaseData);
};

export const deleteSkillCategory = (id: string): Promise<void> =>
  deleteDocument(TABLE, id);
