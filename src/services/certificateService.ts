import { Certificate } from '@/types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/supabase/database';
import { uploadFile, deleteFile } from '@/lib/supabase/storage';

const TABLE = 'certificates';

export const getCertificates = async (): Promise<Certificate[]> => {
  const data = await getCollection(TABLE, { order: { column: 'created_at', ascending: false } });
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    courseName: item.course_name,
    instructorName: item.instructor_name,
    platform: item.platform,
    createdAt: item.created_at
  }));
};

export const addCertificate = async (data: Omit<Certificate, 'id'>): Promise<string> => {
  const supabaseData = {
    name: data.name,
    image: data.image,
    course_name: data.courseName,
    instructor_name: data.instructorName,
    platform: data.platform
  };
  const result = await addDocument(TABLE, supabaseData);
  return result.id;
};

export const updateCertificate = async (id: string, data: Partial<Certificate>): Promise<void> => {
  const supabaseData: any = {};
  if (data.name !== undefined) supabaseData.name = data.name;
  if (data.image !== undefined) supabaseData.image = data.image;
  if (data.courseName !== undefined) supabaseData.course_name = data.courseName;
  if (data.instructorName !== undefined) supabaseData.instructor_name = data.instructorName;
  if (data.platform !== undefined) supabaseData.platform = data.platform;

  await updateDocument(TABLE, id, supabaseData);
};

export const deleteCertificate = (id: string): Promise<void> =>
  deleteDocument(TABLE, id);

export const uploadCertificateImage = (id: string, file: File): Promise<string> =>
  uploadFile(`certificates/${id}`, file);

export const removeCertificateImage = (url: string): Promise<void> =>
  deleteFile(url);
