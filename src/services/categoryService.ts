import { SkillCategory } from '@/types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/supabase/database';

const TABLE = 'skill_categories';

export const getCategories = async (): Promise<SkillCategory[]> => {
  const data = await getCollection(TABLE, { order: { column: 'order_index', ascending: true } });
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
    description: item.description,
    orderIndex: item.order_index,
    createdAt: item.created_at
  }));
};

export const addCategory = async (data: Omit<SkillCategory, 'id' | 'createdAt'>): Promise<string> => {
  // Map frontend orderIndex to backend order_index
  const dbData = {
    name: data.name,
    icon: data.icon,
    description: data.description,
    order_index: data.orderIndex
  };
  const result = await addDocument(TABLE, dbData);
  return result.id;
};

export const updateCategory = async (id: string, data: Partial<SkillCategory>): Promise<void> => {
  const dbData: any = {};
  if (data.name !== undefined) dbData.name = data.name;
  if (data.icon !== undefined) dbData.icon = data.icon;
  if (data.description !== undefined) dbData.description = data.description;
  if (data.orderIndex !== undefined) dbData.order_index = data.orderIndex;
  
  await updateDocument(TABLE, id, dbData);
};

export const deleteCategory = (id: string): Promise<void> =>
  deleteDocument(TABLE, id);
