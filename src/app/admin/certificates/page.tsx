'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiAward, FiImage, FiExternalLink } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  getCertificates, 
  addCertificate, 
  updateCertificate, 
  deleteCertificate,
  uploadCertificateImage,
  removeCertificateImage
} from '@/services/certificateService';
import { Certificate } from '@/types';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const certificateSchema = z.object({
  name: z.string().min(2, 'Name required'),
  image: z.string().min(1, 'Image required'),
  courseName: z.string().min(2, 'Course name required'),
  instructorName: z.string().min(2, 'Instructor name required'),
  platform: z.string().min(2, 'Platform required'),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export default function CertificatesManagement() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  });

  const imageUrl = watch('image');

  useEffect(() => {
    loadCertificates();
  }, []);

  async function loadCertificates() {
    try {
      const data = await getCertificates();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({ name: '', image: '', courseName: '', instructorName: '', platform: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Certificate) => {
    setEditingItem(item);
    reset({
      name: item.name,
      image: item.image,
      courseName: item.courseName,
      instructorName: item.instructorName,
      platform: item.platform,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadCertificateImage(editingItem?.id || 'temp', file);
      setValue('image', url);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleOnSubmit = async (data: CertificateFormData) => {
    setSaving(true);
    try {
      if (editingItem?.id) {
        await updateCertificate(editingItem.id, data);
        toast.success('Certificate updated');
      } else {
        await addCertificate(data);
        toast.success('Certificate added');
      }
      setIsModalOpen(false);
      loadCertificates();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      const itemToDelete = items.find(i => i.id === deletingId);
      if (itemToDelete?.image) {
        await removeCertificateImage(itemToDelete.image);
      }
      await deleteCertificate(deletingId);
      toast.success('Deleted');
      setIsDeleteOpen(false);
      loadCertificates();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Certificates</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your professional certifications and course completions.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <FiPlus />
          Add Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 glass animate-pulse rounded-2xl" />)
        ) : items.length > 0 ? (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl border border-surface-border hover:border-blue-500/30 transition-all flex flex-col group overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <FiAward size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    onClick={() => { setDeletingId(item.id!); setIsDeleteOpen(true); }}
                    className="p-3 bg-red-500/20 backdrop-blur-md rounded-xl text-red-200 hover:bg-red-500/40 transition-all"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-text-secondary font-medium mb-3">{item.courseName}</p>
                  <div className="space-y-1.5">
                    <p className="text-xs text-text-muted font-bold flex items-center gap-1.5">
                      <span className="opacity-50 uppercase tracking-widest font-mono">Platform</span>
                      <span className="text-text-secondary">{item.platform}</span>
                    </p>
                    <p className="text-xs text-text-muted font-bold flex items-center gap-1.5">
                      <span className="opacity-50 uppercase tracking-widest font-mono">Instructor</span>
                      <span className="text-text-secondary">{item.instructorName}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full glass p-20 text-center text-slate-600 italic rounded-2xl">
            No certificates found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Certificate' : 'Add New Certificate'}
        size="lg"
      >
        <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Certificate Name</label>
                <input
                  {...register('name')}
                  placeholder="e.g. Advanced Flutter Specialization"
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Course Name</label>
                <input
                  {...register('courseName')}
                  placeholder="e.g. Flutter & Dart Bootcamp"
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.courseName && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.courseName.message}</p>}
              </div>

              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Instructor</label>
                <input
                  {...register('instructorName')}
                  placeholder="e.g. Dr. Angela Yu"
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.instructorName && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.instructorName.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
               <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Platform / Website</label>
                <input
                  {...register('platform')}
                  placeholder="e.g. Udemy / Coursera"
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.platform && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.platform.message}</p>}
              </div>

              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Certificate Image</label>
                <div className="relative group/upload h-32 rounded-xl border-2 border-dashed border-surface-border flex flex-col items-center justify-center gap-2 overflow-hidden hover:border-blue-500/50 transition-colors">
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-bold">Change Image</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FiImage size={24} className="text-text-muted" />
                      <p className="text-xs text-text-muted font-bold">Click to upload</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-background-card/80 backdrop-blur-sm flex items-center justify-center">
                      <p className="text-xs font-bold text-blue-600 animate-pulse">Uploading...</p>
                    </div>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.image.message}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={saving}
            >
              {editingItem ? 'Save Changes' : 'Add Certificate'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        message="Are you sure you want to remove this certificate? This action cannot be undone."
        isLoading={saving}
      />
    </div>
  );
}
