'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiMessageSquare, FiImage, FiUser } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  getFeedback, 
  addFeedback, 
  updateFeedback, 
  deleteFeedback,
  uploadFeedbackImage,
  removeFeedbackImage
} from '@/services/feedbackService';
import { Feedback } from '@/types';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const feedbackSchema = z.object({
  name: z.string().min(2, 'Name required'),
  image: z.string().min(1, 'Image required'),
  role: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function FeedbackManagement() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Feedback | null>(null);
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
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const imageUrl = watch('image');

  useEffect(() => {
    loadFeedback();
  }, []);

  async function loadFeedback() {
    try {
      const data = await getFeedback();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({ name: '', image: '', role: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Feedback) => {
    setEditingItem(item);
    reset({
      name: item.name,
      image: item.image,
      role: item.role || '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFeedbackImage(editingItem?.id || 'temp', file);
      setValue('image', url);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleOnSubmit = async (data: FeedbackFormData) => {
    setSaving(true);
    try {
      if (editingItem?.id) {
        await updateFeedback(editingItem.id, data);
        toast.success('Feedback updated');
      } else {
        await addFeedback(data);
        toast.success('Feedback added');
      }
      setIsModalOpen(false);
      loadFeedback();
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
        await removeFeedbackImage(itemToDelete.image);
      }
      await deleteFeedback(deletingId);
      toast.success('Deleted');
      setIsDeleteOpen(false);
      loadFeedback();
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
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Feedback & Testimonials</h1>
          <p className="text-text-secondary text-sm mt-1">Manage feedback screenshots and testimonials from clients and colleagues.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <FiPlus />
          Add Feedback
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 glass animate-pulse rounded-2xl" />)
        ) : items.length > 0 ? (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl border border-surface-border hover:border-brand-500/30 transition-all flex flex-col group overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 p-4">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <FiMessageSquare size={48} className="opacity-20" />
                    </div>
                  )}
                </div>
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
              
              <div className="p-5 text-center">
                <h3 className="font-bold text-text-primary mb-1">{item.name}</h3>
                {item.role && (
                  <p className="text-xs text-text-muted font-mono uppercase tracking-widest font-bold">{item.role}</p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full glass p-20 text-center text-slate-600 italic rounded-2xl">
            No feedback found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Feedback' : 'Add New Feedback'}
        size="md"
      >
        <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Feedback Giver Image / Screenshot</label>
              <div className="relative group/upload aspect-[16/9] rounded-2xl border-2 border-dashed border-surface-border flex flex-col items-center justify-center gap-2 overflow-hidden hover:border-blue-500/50 transition-colors">
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
                    <p className="text-xs text-text-muted font-bold">Upload screenshot or photo</p>
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

            <div>
              <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Name</label>
              <input
                {...register('name')}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Role / Company (Optional)</label>
              <input
                {...register('role')}
                placeholder="e.g. CEO at TechCorp"
                className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
              />
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
              {editingItem ? 'Save Changes' : 'Add Feedback'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Feedback"
        message="Are you sure you want to remove this feedback?"
        isLoading={saving}
      />
    </div>
  );
}
