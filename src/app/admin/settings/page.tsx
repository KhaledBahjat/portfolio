'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiUser, FiLink, FiGithub, FiLinkedin, FiMail, FiGlobe, FiBriefcase, FiHash } from 'react-icons/fi';
import { SiCodeforces } from 'react-icons/si';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getSettings, updateSettings, uploadProfileImage } from '@/services/settingsService';
import { Settings } from '@/types';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Image from 'next/image';

const settingsSchema = z.object({
  developerName: z.string().min(2, 'Name required'),
  title: z.string().min(2, 'Title required'),
  tagline: z.string().min(10, 'Tagline too short'),
  bio: z.string().min(20, 'Bio too short'),
  siteTitle: z.string().min(2, 'Site title required'),
  experienceYears: z.preprocess((val) => Number(val), z.number().min(0, 'Must be positive')),
  projectsCompleted: z.preprocess((val) => Number(val), z.number().min(0, 'Must be positive')),
  technologiesCount: z.preprocess((val) => Number(val), z.number().min(0, 'Must be positive')),
  socialLinks: z.object({
    github: z.string().url('Invalid URL').or(z.literal('')),
    linkedin: z.string().url('Invalid URL').or(z.literal('')),
    codeforces: z.string().url('Invalid URL').or(z.literal('')),
    email: z.string().email('Invalid Email').or(z.literal('')),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as any,
  });

  const DEFAULT_SETTINGS: SettingsFormData = {
    developerName: 'Khaled',
    title: 'Software Developer',
    tagline: 'Building the future with code',
    bio: 'A passionate developer focused on creating impactful digital experiences.',
    siteTitle: 'Khaled Portfolio',
    experienceYears: 0,
    projectsCompleted: 0,
    technologiesCount: 0,
    socialLinks: {
      github: '',
      linkedin: '',
      codeforces: '',
      email: ''
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings();
      if (data) {
        reset(data);
        setProfilePreview(data.profileImage);
      } else {
        // No settings found, use defaults
        reset(DEFAULT_SETTINGS);
        console.info('ℹ️ No settings document found, loaded defaults. Save to create the document.');
      }
    } catch (error: any) {
      console.error('FAILED_TO_LOAD_SETTINGS:', error);
      toast.error(`Failed to load settings: ${error.message || 'Unknown error'}`);
      // Even on error, still load defaults so the page isn't broken
      reset(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }

  const handleOnSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      const settingsData = { ...data, profileImage: profilePreview || '' };
      await updateSettings(settingsData);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProfileImage(file);
      setProfilePreview(url);
      toast.success('Profile image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 glass rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 glass rounded-2xl" />
          <div className="h-64 glass rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Global Settings</h1>
          <p className="text-text-secondary text-sm mt-1">Configure your portfolio identity and social presence.</p>
        </div>
        <Button onClick={handleSubmit(handleOnSubmit)} isLoading={saving} className="gap-2">
          <FiSave />
          Save Settings
        </Button>
      </div>

      <form onSubmit={handleSubmit(handleOnSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: General & Bio */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl border border-surface-border space-y-4">
            <h3 className="font-bold text-text-primary flex items-center gap-2 mb-4">
              <FiUser className="text-brand-600 dark:text-brand-400" />
              General Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Developer Name</label>
                <input
                  {...register('developerName')}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.developerName && <p className="text-red-500 text-xs mt-1">{errors.developerName.message}</p>}
              </div>
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Professional Title</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-mono font-medium"
                />
              </div>
            </div>

            <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Short Tagline</label>
                <input
                  {...register('tagline')}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                {errors.tagline && <p className="text-red-500 text-xs mt-1">{errors.tagline.message}</p>}
            </div>

            <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">About Bio</label>
                <textarea
                  {...register('bio')}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all resize-none font-medium leading-relaxed"
                />
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-surface-border space-y-4">
            <h3 className="font-bold text-text-primary flex items-center gap-2 mb-4">
              <FiHash className="text-brand-600 dark:text-brand-400" />
              About Section Counters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Years of Exp.</label>
                <input
                  type="number"
                  {...register('experienceYears')}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-surface-border text-text-primary focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                />
                {errors.experienceYears && <p className="text-red-500 text-xs mt-1">{errors.experienceYears.message}</p>}
              </div>
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Projects</label>
                <input
                  type="number"
                  {...register('projectsCompleted')}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-surface-border text-text-primary focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                />
                {errors.projectsCompleted && <p className="text-red-500 text-xs mt-1">{errors.projectsCompleted.message}</p>}
              </div>
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Technologies</label>
                <input
                  type="number"
                  {...register('technologiesCount')}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-surface-border text-text-primary focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                />
                {errors.technologiesCount && <p className="text-red-500 text-xs mt-1">{errors.technologiesCount.message}</p>}
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-surface-border space-y-4">
            <h3 className="font-bold text-text-primary flex items-center gap-2 mb-4">
              <FiGlobe className="text-accent-600 dark:text-accent-400" />
              SEO & Appearance
            </h3>
            <div>
              <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5 ml-1 font-bold">Site Title (Metadata)</label>
              <input
                {...register('siteTitle')}
                className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-surface-border text-text-primary focus:outline-none focus:border-brand-500/50 transition-all font-medium"
              />
              {errors.siteTitle && <p className="text-red-500 text-xs mt-1">{errors.siteTitle.message}</p>}
            </div>
          </div>
        </div>

        {/* Right: Avatar & Socials */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-surface-border">
            <h3 className="font-bold text-text-primary flex items-center gap-2 mb-6">
              <FiBriefcase className="text-brand-600 dark:text-brand-400" />
              Profile Avatar
            </h3>
            
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-surface-border bg-surface-dark mb-4">
                {profilePreview ? (
                  <Image src={profilePreview} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <FiUser size={48} />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer px-4 py-2 rounded-xl border border-surface-border hover:border-brand-500/50 hover:bg-brand-500/5 transition-all text-xs font-bold text-text-secondary">
                Change Image
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-surface-border space-y-4">
            <h3 className="font-bold text-text-primary flex items-center gap-2 mb-4">
              <FiLink className="text-emerald-600 dark:text-emerald-400" />
              Social Links
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass border border-surface-border flex items-center justify-center text-slate-500 shrink-0"><FiGithub /></div>
                <input {...register('socialLinks.github')} placeholder="GitHub URL" className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-400/50" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass border border-surface-border flex items-center justify-center text-[#0077b5] shrink-0"><FiLinkedin /></div>
                <input {...register('socialLinks.linkedin')} placeholder="LinkedIn URL" className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-400/50" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass border border-surface-border flex items-center justify-center text-[#ff3333] shrink-0"><SiCodeforces /></div>
                <input {...register('socialLinks.codeforces')} placeholder="Codeforces URL" className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-400/50" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass border border-surface-border flex items-center justify-center text-blue-400 shrink-0"><FiMail /></div>
                <input {...register('socialLinks.email')} placeholder="Contact Email" className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-400/50" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
