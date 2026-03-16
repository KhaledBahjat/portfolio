'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiSearch, FiClock, FiCheckCircle, FiUser, FiMaximize2 } from 'react-icons/fi';
import { getMessages, markAsRead, deleteMessage } from '@/services/messageService';
import { Message } from '@/types';
import { toast } from 'react-hot-toast';
import { formatRelative, formatDate } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setBusy(true);
    try {
      await deleteMessage(deletingId);
      toast.success('Message deleted');
      setIsDeleteOpen(false);
      loadMessages();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  const handleViewMessage = (msg: Message) => {
    setSelectedMessage(msg);
    setIsViewOpen(true);
    if (!msg.read) {
      handleMarkRead(msg.id!);
    }
  };

  const filtered = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Contact Messages</h1>
        <p className="text-text-secondary text-sm mt-1">Review and manage inquiries from your portfolio contact form.</p>
      </div>

      <div className="glass p-4 rounded-2xl border border-surface-border flex items-center gap-4 shadow-sm">
        <FiSearch className="text-text-muted ml-2" />
        <input
          type="text"
          placeholder="Search by name, email or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-secondary/50 text-sm"
        />
        <div className="text-xs text-text-secondary font-mono px-3 font-bold">
          {filtered.length} messages
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-44 glass animate-pulse rounded-2xl" />)
        ) : filtered.length > 0 ? (
          filtered.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              className={`glass p-5 rounded-2xl border transition-all group relative flex flex-col ${
                msg.read ? 'border-surface-border' : 'border-blue-500/40 bg-blue-500/5'
              }`}
            >
              {!msg.read && (
                <div className="absolute top-4 right-4">
                  <Badge variant="primary" className="shadow-lg shadow-blue-500/20 animate-pulse">New</Badge>
                </div>
              )}
              
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface-dark border border-surface-border flex items-center justify-center text-text-secondary font-bold shrink-0 shadow-sm">
                  {msg.name[0]}
                </div>
                <div className="min-w-0 pr-12">
                  <h3 className="font-bold text-text-primary truncate">{msg.name}</h3>
                  <p className="text-xs text-text-muted truncate lowercase font-medium">{msg.email}</p>
                </div>
              </div>

              <p className="text-text-secondary text-sm line-clamp-3 mb-6 flex-1 italic font-medium leading-relaxed">
                &quot;{msg.message}&quot;
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-border/50">
                <div className="flex items-center gap-2 text-[10px] text-text-muted uppercase font-mono tracking-wider font-bold">
                  <FiClock className="text-blue-600 dark:text-blue-400" />
                  <span>{formatRelative(msg.createdAt)}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewMessage(msg)}
                    className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    title="View Message"
                  >
                    <FiMaximize2 size={16} />
                  </button>
                  <button
                    onClick={() => { setDeletingId(msg.id!); setIsDeleteOpen(true); }}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete Message"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 glass p-20 text-center text-slate-600 italic rounded-2xl">
            No messages found.
          </div>
        )}
      </div>

      {/* View Message Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Message Details"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-dark border border-surface-border">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xl font-bold">
                {selectedMessage.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-200">{selectedMessage.name}</h4>
                <p className="text-sm text-blue-400">{selectedMessage.email}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Received</p>
                <p className="text-xs text-slate-300">{formatDate(selectedMessage.createdAt)}</p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-surface-border bg-white/5 min-h-[150px]">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry`}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold text-center hover:bg-blue-500 transition-all shadow-glow"
              >
                Reply via Email
              </a>
              <Button
                variant="ghost"
                onClick={() => setIsViewOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Permanently remove this message from your records?"
        isLoading={busy}
      />
    </div>
  );
}
