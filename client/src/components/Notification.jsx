import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  X, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'success',
    title: 'VIP Pass Verified',
    message: 'Kelechi Okafor checked in at Gate North via Terminal #1.',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Duplicate Screen Blocked',
    message: 'Replay attempt blocked at Gate East. Ticket already validated.',
    time: '12m ago',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'WhatsApp Batch Sent',
    message: '350 digital passes dispatched to registered attendees.',
    time: '1h ago',
    read: true,
  },
];

export const triggerToast = (type, title, message) => {
  const content = (
    <div className="flex flex-col text-sm">
      <span className="font-bold">{title}</span>
      {message && <span className="text-xs opacity-90 mt-0.5">{message}</span>}
    </div>
  );

  switch (type) {
    case 'success':
      toast.success(content, { id: title });
      break;
    case 'error':
      toast.error(content, { id: title });
      break;
    case 'warning':
      toast(content, { icon: '⚠️', id: title });
      break;
    default:
      toast(content, { icon: 'ℹ️', id: title });
      break;
  }
};

const Notification = ({
  isOpen,
  onClose,
  notifications = INITIAL_NOTIFICATIONS,
  onUpdateNotifications,
}) => {
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = items.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );
    setItems(updated);
    if (onUpdateNotifications) onUpdateNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = items.map((item) => ({ ...item, read: true }));
    setItems(updated);
    if (onUpdateNotifications) onUpdateNotifications(updated);
    toast.success('All notifications marked as read');
  };

  const clearAll = () => {
    setItems([]);
    if (onUpdateNotifications) onUpdateNotifications([]);
    toast.success('Notification list cleared');
  };

  const addTestNotification = () => {
    const types = ['success', 'info', 'warning', 'error'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const newNotif = {
      id: Date.now().toString(),
      type: randomType,
      title: `Gate Activity [${randomType.toUpperCase()}]`,
      message: 'New access control telemetry received from Gate Scanner.',
      time: 'Just now',
      read: false,
    };
    const updated = [newNotif, ...items];
    setItems(updated);
    if (onUpdateNotifications) onUpdateNotifications(updated);
    triggerToast(randomType, newNotif.title, newNotif.message);
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'unread') return !item.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Info className="w-4 h-4 text-[#51369B] dark:text-indigo-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden animate-fade-in text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="relative p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#51369B] dark:text-indigo-400">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-black bg-[#51369B] dark:bg-indigo-500 text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {items.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#51369B] dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck size={16} />
            </button>
          )}
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Clear all"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-white dark:bg-[#111827]">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#51369B] dark:bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              filter === 'unread'
                ? 'bg-[#51369B] dark:bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <button
          onClick={addTestNotification}
          className="text-[#51369B] dark:text-indigo-400 hover:underline font-bold cursor-pointer"
        >
          + Test Alert
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Bell size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No notifications</p>
            <p className="text-xs mt-1">Gate feeds are all clear.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                item.read 
                  ? 'bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800/60' 
                  : 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40'
              }`}
            >
              <div className="mt-0.5 shrink-0 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs truncate ${item.read ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-bold text-slate-900 dark:text-white'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {item.message}
                </p>
              </div>
              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-[#51369B] dark:bg-indigo-500 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 text-center border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          Live Gate Telemetry Connected
        </span>
      </div>
    </div>
  );
};

export default Notification;
