'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase, FiBook, FiCalendar } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getExperience, addExperience, updateExperience, deleteExperience } from '@/services/experienceService';
import { Experience } from '@/types';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';

const experienceSchema = z.object({
  title: z.string().min(2, 'Title required'),
  organization: z.string().min(2, 'Organization required'),
  description: z.string().min(10, 'Description too short'),
  startDate: z.string().min(4, 'Start date required (e.g. 2022-09)'),
  endDate: z.string().nullable(),
  type: z.enum(['work', 'education']),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export default function ExperienceManagement() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
  });

  useEffect(() => {
    loadExperience();
  }, []);

  async function loadExperience() {
    try {
      const data = await getExperience();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({ title: '', organization: '', description: '', startDate: '', endDate: null, type: 'work' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Experience) => {
    setEditingItem(item);
    reset({
      title: item.title,
      organization: item.organization,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      type: item.type,
    });
    setIsModalOpen(true);
  };

  const handleOnSubmit = async (data: ExperienceFormData) => {
    setSaving(true);
    try {
      if (editingItem?.id) {
        await updateExperience(editingItem.id, data);
        toast.success('Experience updated');
      } else {
        await addExperience(data);
        toast.success('Experience added');
      }
      setIsModalOpen(false);
      loadExperience();
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
      await deleteExperience(deletingId);
      toast.success('Deleted');
      setIsDeleteOpen(false);
      loadExperience();
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
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Experience & Education</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your professional career timeline and academic background.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <FiPlus />
          Add Entry
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-32 glass animate-pulse rounded-2xl" />)
        ) : items.length > 0 ? (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-6 rounded-2xl border border-surface-border hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-6 group"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === 'work' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'bg-violet-500/10 text-violet-700 dark:text-violet-400'
                  }`}>
                    {item.type === 'work' ? <FiBriefcase size={20} /> : <FiBook size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">{item.title}</h3>
                    <p className="text-sm text-text-secondary font-medium">{item.organization}</p>
                  </div>
                  <Badge variant={item.type === 'work' ? 'primary' : 'secondary'} className="ml-auto md:ml-0 px-3 capitalize">
                    {item.type}
                  </Badge>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 font-medium">{item.description}</p>
                <div className="flex items-center gap-2 text-xs text-text-muted font-mono font-bold">
                  <FiCalendar size={14} className="text-blue-600 dark:text-blue-400 opacity-70" />
                   {item.startDate} — {item.endDate ?? 'Present'}
                </div>
              </div>
              
              <div className="flex md:flex-col gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="flex-1 md:flex-none p-3 rounded-xl glass border border-surface-border text-text-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <FiEdit2 size={16} />
                  <span className="md:hidden text-sm">Edit</span>
                </button>
                <button
                  onClick={() => { setDeletingId(item.id!); setIsDeleteOpen(true); }}
                  className="flex-1 md:flex-none p-3 rounded-xl glass border border-surface-border text-text-secondary hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <FiTrash2 size={16} />
                   <span className="md:hidden text-sm">Delete</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass p-20 text-center text-slate-600 italic rounded-2xl">
            No entries found.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Entry' : 'Add New Entry'}
        size="lg"
      >
        <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Title</label>
                <input
                  {...register('title')}
                  placeholder="e.g. Senior Flutter Developer"
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Organization</label>
                <input
                  {...register('organization')}
                  placeholder="e.g. Google"
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.organization && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.organization.message}</p>}
              </div>

              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue('type', 'work')}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                      watch('type') === 'work' ? 'bg-brand-600 border-brand-600 text-white shadow-glow' : 'border-surface-border text-text-secondary hover:bg-background-primary'
                    }`}
                  >
                    Work Experience
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('type', 'education')}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                      watch('type') === 'education' ? 'bg-brand-600 border-brand-600 text-white shadow-glow' : 'border-surface-border text-text-secondary hover:bg-background-primary'
                    }`}
                  >
                    Education
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Start Date</label>
                  <input
                    {...register('startDate')}
                    placeholder="2022-09"
                    className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all font-mono font-medium"
                  />
                  {errors.startDate && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.startDate.message}</p>}
                </div>
                <div>
                  <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">End Date</label>
                  <input
                    {...register('endDate')}
                    placeholder="Present"
                    className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Description</label>
                <textarea
                  {...register('description')}
                  rows={5}
                  placeholder="Describe your role and achievements..."
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all resize-none font-medium leading-relaxed"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.description.message}</p>}
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
              {editingItem ? 'Save Changes' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Entry"
        message="Are you sure you want to remove this entry from your journey?"
        isLoading={saving}
      />
    </div>
  );
}
