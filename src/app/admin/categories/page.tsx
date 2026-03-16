'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLayers, FiMove } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import { SkillCategory } from '@/types';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const categorySchema = z.object({
  name: z.string().min(1, 'Name required'),
  icon: z.string().min(1, 'Icon required'),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingCategory(null);
    reset({ name: '', icon: '📁', description: '', orderIndex: categories.length });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: SkillCategory) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      icon: category.icon,
      description: category.description || '',
      orderIndex: category.orderIndex,
    });
    setIsModalOpen(true);
  };

  const handleOnSubmit = async (data: CategoryFormData) => {
    setSaving(true);
    try {
      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, data);
        toast.success('Category updated');
      } else {
        // Validation for duplicate names
        if (categories.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
          toast.error('A category with this name already exists');
          setSaving(false);
          return;
        }
        await addCategory(data);
        toast.success('Category added');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Category name already exists');
      } else {
        toast.error('Operation failed');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await deleteCategory(deletingId);
      toast.success('Category deleted');
      setIsDeleteOpen(false);
      loadCategories();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Skill Categories</h1>
          <p className="text-text-secondary text-sm mt-1">Manage categories for grouping your technical skills.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <FiPlus />
          Add Category
        </Button>
      </div>

      <div className="glass p-4 rounded-2xl border border-surface-border flex items-center gap-4 shadow-sm">
        <FiSearch className="text-text-muted ml-2" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-secondary/50 text-sm"
        />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 glass animate-pulse rounded-2xl" />)}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              layout
              className="glass p-5 rounded-2xl border border-surface-border hover:border-blue-500/30 transition-all group relative"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-dark flex items-center justify-center text-2xl border border-surface-border group-hover:border-blue-500/50 transition-all drop-shadow-sm">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-primary truncate">{category.name}</h3>
                  <p className="text-xs text-text-muted font-mono italic">Order: {category.orderIndex}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(category)} className="p-1.5 text-slate-400 hover:text-blue-400"><FiEdit2 size={16} /></button>
                  <button onClick={() => { setDeletingId(category.id); setIsDeleteOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-400"><FiTrash2 size={16} /></button>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary line-clamp-2 min-h-[2.5rem] font-medium leading-relaxed">
                {category.description || 'No description provided.'}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass p-20 text-center text-slate-600 italic rounded-2xl">
          {search ? 'No categories match your search.' : 'No categories found. Create your first one!'}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Category Name</label>
              <input
                {...register('name')}
                placeholder="e.g. Programming"
                className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.name.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Icon (Emoji/HTML)</label>
              <input
                {...register('icon')}
                placeholder="e.g. 💻"
                className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
              />
              {errors.icon && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.icon.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Description</label>
            <textarea
              {...register('description')}
              placeholder="Brief description of skills in this category..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all resize-none font-medium"
            />
          </div>

          <div>
            <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Display Order</label>
            <input
              type="number"
              {...register('orderIndex', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
            />
            <p className="text-[10px] text-text-muted mt-1 ml-1 font-bold">Lower numbers appear first in the list.</p>
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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to remove this category? Skills already assigned to this category will keep their current category name but won't be grouped under a valid dynamic category unless reassigned."
        isLoading={saving}
      />
    </div>
  );
}
