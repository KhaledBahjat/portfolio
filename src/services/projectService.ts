import { Project } from '@/types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/supabase/database';
import { uploadFile, deleteFile } from '@/lib/supabase/storage';

const TABLE = 'projects';

export const getProjects = async (): Promise<Project[]> => {
  const data = await getCollection(TABLE, { order: { column: 'created_at', ascending: false } });
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    techStack: item.tech_stack || [],
    githubUrl: item.github_url || '',
    demoUrl: item.demo_url || '',
    images: item.images || [],
    category: item.category || '',
    featured: item.featured || false,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
};

export const addProject = async (data: Omit<Project, 'id'>): Promise<string> => {
  const supabaseData = {
    title: data.title,
    description: data.description,
    tech_stack: data.techStack,
    github_url: data.githubUrl,
    demo_url: data.demoUrl,
    images: data.images,
    category: data.category,
    featured: data.featured
  };
  const result = await addDocument(TABLE, supabaseData);
  return result.id;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
  const supabaseData: any = {};
  if (data.title !== undefined) supabaseData.title = data.title;
  if (data.description !== undefined) supabaseData.description = data.description;
  if (data.techStack !== undefined) supabaseData.tech_stack = data.techStack;
  if (data.githubUrl !== undefined) supabaseData.github_url = data.githubUrl;
  if (data.demoUrl !== undefined) supabaseData.demo_url = data.demoUrl;
  if (data.images !== undefined) supabaseData.images = data.images;
  if (data.category !== undefined) supabaseData.category = data.category;
  if (data.featured !== undefined) supabaseData.featured = data.featured;

  await updateDocument(TABLE, id, supabaseData);
};

export const deleteProject = (id: string): Promise<void> =>
  deleteDocument(TABLE, id);

export const uploadProjectImage = (projectId: string, file: File): Promise<string> =>
  uploadFile(`projects/${projectId}`, file);

export const removeProjectImage = (url: string): Promise<void> =>
  deleteFile(url);
