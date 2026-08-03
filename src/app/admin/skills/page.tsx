'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLayers, FiUploadCloud } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getSkills, addSkill, updateSkill, deleteSkill } from '@/services/skillService';
import { getCategories } from '@/services/categoryService';
import { Skill, SkillCategory } from '@/types';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { uploadFile, validateUploadFile } from '@/lib/supabase/storage';

const skillSchema = z.object({
  name: z.string().min(1, 'Name required'),
  category: z.string().min(1, 'Category required'),
  icon: z.string().min(1, 'Icon emoji or class required'),
});

type SkillFormData = z.infer<typeof skillSchema>;

export default function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [selectedIconPreview, setSelectedIconPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      icon: '🚀',
    },
  });

  const iconValue = watch('icon') || '';

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [skillsData, categoriesData] = await Promise.all([
        getSkills(),
        getCategories()
      ]);
      setSkills(skillsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingSkill(null);
    reset({
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      icon: '🚀'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    reset({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
    });
    setIsModalOpen(true);
  };

  const handleIconUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateUploadFile(file);

      const previewUrl = URL.createObjectURL(file);
      setSelectedIconPreview(previewUrl);

      setUploadingIcon(true);
      const url = await uploadFile('skills/icons', file);
      setValue('icon', url, { shouldValidate: true });
      toast.success('Icon uploaded');
    } catch (error) {
      setSelectedIconPreview(null);
      toast.error(error instanceof Error ? error.message : 'Icon upload failed');
    } finally {
      setUploadingIcon(false);
      event.target.value = '';
    }
  };

  const handleOnSubmit = async (data: SkillFormData) => {
    setSaving(true);
    try {
      if (editingSkill?.id) {
        await updateSkill(editingSkill.id, data);
        toast.success('Skill updated');
      } else {
        await addSkill(data);
        toast.success('Skill added');
      }
      setIsModalOpen(false);
      loadData();
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
      await deleteSkill(deletingId);
      toast.success('Skill deleted');
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const filteredSkills = skills.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Manage Skills</h1>
          <p className="text-text-secondary text-sm mt-1">Organize your technical expertise categories.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <FiPlus />
          Add Skill
        </Button>
      </div>

      <div className="glass p-4 rounded-2xl border border-surface-border flex items-center gap-4 shadow-sm">
        <FiSearch className="text-text-muted ml-2" />
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-secondary/50 text-sm"
        />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 glass animate-pulse rounded-2xl" />)}
        </div>
      ) : Object.keys(groupedSkills).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-widest text-blue-400 flex items-center gap-2">
                <FiLayers size={14} />
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((skill) => (
                  <motion.div
                    key={skill.id}
                    layout
                    className="glass p-5 rounded-2xl border border-surface-border hover:border-blue-500/30 transition-all group relative"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl drop-shadow-sm">{skill.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text-primary truncate">{skill.name}</h3>
                        <p className="text-[10px] text-text-secondary font-mono italic">{skill.category}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(skill)} className="p-1.5 text-slate-500 hover:text-blue-400"><FiEdit2 size={14} /></button>
                        <button onClick={() => { setDeletingId(skill.id!); setIsDeleteOpen(true); }} className="p-1.5 text-slate-500 hover:text-red-400"><FiTrash2 size={14} /></button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass p-20 text-center text-slate-600 italic rounded-2xl">
          No skills found. Add your first skill!
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Skill Name</label>
              <input
                {...register('name')}
                placeholder="e.g. Flutter"
                className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Icon</label>
              <input
                {...register('icon')}
                value={iconValue}
                onChange={(event) => setValue('icon', event.target.value, { shouldValidate: true })}
                placeholder="Emoji, URL, or uploaded icon path"
                className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Upload Icon (SVG/PNG)</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-surface-border px-4 py-3 text-sm text-text-secondary transition hover:border-blue-500/40 hover:text-blue-400">
              <FiUploadCloud />
              <span>{uploadingIcon ? 'Uploading...' : 'Upload SVG / PNG / JPG / JPEG / WEBP / ICO / AVIF'}</span>
              <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,.ico,.avif,image/svg+xml,image/png,image/jpeg,image/webp,image/avif,image/x-icon" className="hidden" onChange={handleIconUpload} />
            </label>
            {(selectedIconPreview || iconValue) && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-surface-border bg-background-card/60 px-3 py-2 text-sm text-text-secondary">
                {selectedIconPreview ? (
                  <img src={selectedIconPreview} alt="Icon preview" className="h-6 w-6 object-contain" />
                ) : iconValue.startsWith('http') || iconValue.startsWith('/') || iconValue.startsWith('data:') ? (
                  <img src={iconValue} alt="" className="h-6 w-6 object-contain" />
                ) : (
                  <span className="text-xl">{iconValue}</span>
                )}
                <span className="truncate">{iconValue || 'Preview available'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Category</label>
            <div className="relative group/select">
              <select
                {...register('category')}
                className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all appearance-none cursor-pointer font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-background-card text-text-primary">
                    {cat.icon} {cat.name}
                  </option>
                ))}
                {categories.length === 0 && (
                  <option value="" disabled className="bg-background-card text-text-muted">No categories available</option>
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-500 pointer-events-none">
                <FiLayers size={14} />
              </div>
            </div>
            {errors.category && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.category.message}</p>}
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
              {editingSkill ? 'Save Changes' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message="Are you sure you want to remove this skill from your profile?"
        isLoading={saving}
      />
    </div>
  );
}
