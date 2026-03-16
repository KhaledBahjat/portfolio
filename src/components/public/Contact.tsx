'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiSend, FiMail, FiMapPin, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { submitMessage } from '@/services/messageService';
import { useLanguage } from '@/context/LanguageContext';
import { Settings } from '@/types';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface ContactProps {
  settings: Settings | null;
}

export default function Contact({ settings }: ContactProps) {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const contactEmail = settings?.socialLinks?.email || 'khaledbahjat0@gmail.com';
  const contactPhone = settings?.socialLinks?.phone || '+964 770 000 0000';
  const contactLocation = settings?.socialLinks?.location || (language === 'en' ? 'Kirkuk, Iraq' : 'كركوك، العراق');

  const contactSchema = useMemo(() => z.object({
    name: z.string().min(2, language === 'en' ? 'Name is too short' : 'الاسم قصير جداً'),
    email: z.string().email(language === 'en' ? 'Invalid email address' : 'بريد إلكتروني غير صالح'),
    message: z.string().min(10, language === 'en' ? 'Message is too short' : 'الرسالة قصيرة جداً'),
  }), [language]);

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitMessage(data);
      setIsSuccess(true);
      toast.success(t('contact.form.success'));
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to send message. Please try again.' : 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail className="text-brand-600 dark:text-brand-400" />,
      label: t('contact.info.email'),
      value: contactEmail,
      href: `mailto:${contactEmail}`,
    },
    {
      icon: <FiMapPin className="text-brand-600 dark:text-brand-400" />,
      label: t('contact.info.location'),
      value: contactLocation,
      href: '#',
    },
    {
      icon: <FiPhone className="text-brand-600 dark:text-brand-400" />,
      label: t('contact.info.phone'),
      value: contactPhone,
      href: `tel:${contactPhone.replace(/\s/g, '')}`,
    },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4">{t('contact.title')}</h2>
            <h3 className="text-4xl font-bold text-text-primary mb-6">
              {t('contact.subtitle').includes('extraordinary') ? (
                <>
                  {t('contact.subtitle').split('extraordinary')[0]}
                  <span className="gradient-text">extraordinary</span>
                  {t('contact.subtitle').split('extraordinary')[1]}
                </>
              ) : t('contact.subtitle').includes('غير عادية') ? (
                <>
                  {t('contact.subtitle').split('غير عادية')[0]}
                  <span className="gradient-text">غير عادية</span>
                  {t('contact.subtitle').split('غير عادية')[1]}
                </>
              ) : (
                t('contact.subtitle')
              )}
            </h3>
            <p className="text-text-secondary max-w-2xl mx-auto font-medium">
              {t('contact.description')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((info, i) =>                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 rounded-2xl border border-surface-border flex items-center gap-4 hover:border-blue-500/50 transition-all group shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-xl dark:hover:shadow-blue-500/5 hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface-dark flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs text-text-muted font-mono uppercase tracking-widest font-bold mb-0.5">{info.label}</p>
                      <p className="text-text-primary font-bold">{info.value}</p>
                    </div>
                  </motion.a>
              )}
            </div>

            {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 glass p-8 rounded-3xl border border-surface-border relative shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none"
              >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-2 ml-1 font-bold">{t('contact.form.name')}</label>
                    <input
                      {...register('name')}
                      placeholder={t('contact.form.placeholder_name')}
                      className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-2 ml-1 font-bold">{t('contact.form.email')}</label>
                    <input
                      {...register('email')}
                      placeholder={t('contact.form.placeholder_email')}
                      className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.email.message}</p>}
                  </div>
                </div>

                  <div>
                    <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-2 ml-1 font-bold">{t('contact.form.message')}</label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder={t('contact.form.placeholder_message')}
                      className="w-full px-4 py-3 rounded-xl bg-background-card border border-surface-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500/50 transition-all resize-none font-medium"
                    />
                    {errors.message && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.message.message}</p>}
                  </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSuccess}
                  size="lg"
                  className={`w-full ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : ''}`}
                >
                  {isSuccess ? (
                    <>
                      <FiCheckCircle size={20} />
                      {t('contact.form.success')}
                    </>
                  ) : (
                    <>
                      <FiSend />
                      {t('contact.form.send')}
                    </>
                  )}
                </Button>
              </form>

              {/* Success Decoration */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-bg-card/95 dark:bg-bg-primary/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-8 z-10 border border-emerald-500/30"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                    <FiCheckCircle size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-text-primary mb-2">{t('contact.form.thank_you')}</h4>
                  <p className="text-text-secondary">{t('contact.form.received')}</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-blue-600 dark:text-blue-400 font-mono text-sm hover:underline"
                  >
                    {t('contact.form.send_another')}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
