'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiGithub, FiExternalLink, FiX, FiCheck, FiLayers 
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  getProjects, addProject, updateProject, deleteProject, uploadProjectImage 
} from '@/services/projectService';
import { Project } from '@/types';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';

const projectSchema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().min(10, 'Description too short'),
  category: z.string().min(1, 'Category required'),
  githubUrl: z.string().url('Invalid URL').or(z.literal('')),
  demoUrl: z.string().url('Invalid URL').or(z.literal('')),
  featured: z.boolean(),
  techStack: z.array(z.string()).min(1, 'Select at least one tech'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  // Image upload state
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newTech, setNewTech] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      techStack: [],
      featured: false,
    },
  });

  const selectedTechs = watch('techStack') || [];

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingProject(null);
    setImages([]);
    reset({
      title: '',
      description: '',
      category: 'Flutter',
      githubUrl: '',
      demoUrl: '',
      featured: false,
      techStack: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setImages(project.images || []);
    reset({
      title: project.title,
      description: project.description,
      category: project.category,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      featured: project.featured,
      techStack: project.techStack,
    });
    setIsModalOpen(true);
  };

  const handleOnSubmit = async (data: ProjectFormData) => {
    setUploading(true);
    try {
      const projectData = { ...data, images };
      if (editingProject?.id) {
        await updateProject(editingProject.id, projectData);
        toast.success('Project updated');
      } else {
        await addProject(projectData);
        toast.success('Project created');
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setUploading(true);
    try {
      await deleteProject(deletingId);
      toast.success('Project deleted');
      setIsDeleteOpen(false);
      loadProjects();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Temporary ID for path if creating new
      const tempId = editingProject?.id || 'new';
      const url = await uploadProjectImage(tempId, file);
      setImages((prev) => [...prev, url]);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTech = (tech: string) => {
    const current = [...selectedTechs];
    const index = current.indexOf(tech);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(tech);
    }
    setValue('techStack', current, { shouldDirty: true, shouldValidate: true });
  };

  const handleAddCustomTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
    if (e.type === 'keydown') e.preventDefault();
    
    const tech = newTech.trim();
    if (tech && !selectedTechs.includes(tech)) {
      const updated = [...selectedTechs, tech];
      setValue('techStack', updated, { shouldDirty: true, shouldValidate: true });
      setNewTech('');
      
      // Add to commonTechs locally if desired? 
      // For now just adding to specific project stack
    }
  };

  const commonTechs = ['Flutter', 'Dart', 'Firebase', 'Firebase Auth', 'Firestore', 'Auth', 'REST API', 'Provider', 'Riverpod', 'Hive', 'SQLite'];

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Manage Projects</h1>
          <p className="text-text-secondary text-sm mt-1">Add, edit, or remove projects from your portfolio.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <FiPlus />
          Add Project
        </Button>
      </div>

      {/* Table/List Filter */}
      <div className="glass p-4 rounded-2xl border border-surface-border flex items-center gap-4 shadow-sm">
        <FiSearch className="text-text-muted ml-2" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-muted text-sm font-medium"
        />
        <div className="text-xs text-text-muted font-mono px-3 font-bold">
          {filteredProjects.length} projects found
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass rounded-2xl border border-surface-border overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-border bg-white/5 text-text-muted font-bold uppercase text-[10px] tracking-widest">
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tech Stack</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 w-32 bg-surface-border rounded" /></td>
                    <td className="p-4"><div className="h-4 w-20 bg-surface-border rounded" /></td>
                    <td className="p-4"><div className="h-4 w-40 bg-surface-border rounded" /></td>
                    <td className="p-4"><div className="h-4 w-12 bg-surface-border rounded" /></td>
                    <td className="p-4 text-right"><div className="h-8 w-20 bg-surface-border rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-surface-border overflow-hidden flex items-center justify-center shrink-0">
                          {project.images?.[0] ? (
                            <Image src={project.images[0]} alt="" width={40} height={40} className="object-cover" />
                          ) : (
                            <FiImage size={18} className="text-text-muted" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary truncate max-w-[200px]">{project.title}</p>
                          <div className="flex gap-3 mt-1">
                            {project.githubUrl && <FiGithub size={12} className="text-text-muted hover:text-blue-500 transition-colors cursor-pointer" />}
                            {project.demoUrl && <FiExternalLink size={12} className="text-text-muted hover:text-blue-500 transition-colors cursor-pointer" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{project.category}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {project.techStack.slice(0, 3).map(t => (
                          <Badge key={t} variant="primary" className="text-[10px]">{t}</Badge>
                        ))}
                        {project.techStack.length > 3 && <span className="text-text-muted text-[10px] font-bold">+{project.techStack.length - 3}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                        project.featured 
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' 
                          : 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20'
                      }`}>
                        {project.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-2 rounded-lg text-text-muted hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all font-bold"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => { setDeletingId(project.id!); setIsDeleteOpen(true); }}
                          className="p-2 rounded-lg text-text-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all font-bold"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-600 italic">
                    No projects found. Add your first project!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !uploading && setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Project Title</label>
                <input
                  {...register('title')}
                  placeholder="e.g. Flutter Chat App"
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Category</label>
                <div className="relative group/select">
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all appearance-none cursor-pointer font-medium"
                  >
                    <option value="Flutter" className="bg-background-card">Flutter</option>
                    <option value="Dart" className="bg-background-card">Dart</option>
                    <option value="Mobile" className="bg-background-card">Mobile</option>
                    <option value="Web" className="bg-background-card">Web</option>
                    <option value="Desktop" className="bg-background-card">Desktop</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-500">
                    <FiLayers size={14} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">GitHub URL</label>
                  <input
                    {...register('githubUrl')}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Live Demo URL</label>
                  <input
                    {...register('demoUrl')}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-surface-border bg-background-primary/50">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="w-5 h-5 rounded border-surface-border bg-background-card text-brand-500 focus:ring-brand-500/20"
                />
                <label htmlFor="featured" className="text-text-primary font-bold select-none cursor-pointer">
                  Featured Project
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="What makes this project special?"
                  className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all resize-none font-medium leading-relaxed"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Tech Stack</label>
                
                {/* Custom Tech Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={handleAddCustomTech}
                    placeholder="Add custom tech..."
                    className="flex-1 px-3 py-2 rounded-lg bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTech}
                    className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all shrink-0"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3 max-h-[120px] overflow-y-auto p-2 border border-surface-border rounded-xl bg-background-primary/30">
                  {/* Selected/Custom Techs first */}
                  {selectedTechs.filter(t => !commonTechs.includes(t)).map(tech => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 bg-blue-600 border-blue-600 text-white"
                    >
                      {tech}
                      <FiCheck size={10} />
                    </button>
                  ))}
                  
                  {/* Predefined Techs */}
                  {commonTechs.map(tech => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        selectedTechs.includes(tech)
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'border-surface-border text-text-secondary hover:border-blue-500/30 font-medium'
                      }`}
                    >
                      {tech}
                      {selectedTechs.includes(tech) && <FiCheck size={10} />}
                    </button>
                  ))}
                </div>
                {errors.techStack && <p className="text-red-500 text-xs mt-1 ml-1">{errors.techStack.message}</p>}
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-3 ml-1 font-bold">Project Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((url, i) => (
                <div key={i} className="relative group aspect-video rounded-xl border border-surface-border overflow-hidden bg-bg-secondary">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-video rounded-xl border-2 border-dashed border-surface-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <FiPlus className="text-text-muted group-hover:text-blue-500 transition-colors" size={24} />
                    <span className="text-[10px] text-text-muted mt-1 font-mono uppercase font-bold">Upload</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={uploading}
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        isLoading={uploading}
      />
    </div>
  );
}
