import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

interface NotificationContextType {
  notifications: NotificationProps[];
  addNotification: (notification: Omit<NotificationProps, 'id'>) => void;
  removeNotification: (id: string) => void;
  showConfirm: (title: string, message: string) => Promise<boolean>;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showConfirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmDialog({
        title,
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  };

  const handleConfirm = () => {
    if (confirmDialog) {
      confirmDialog.onConfirm();
      setConfirmDialog(null);
    }
  };

  const handleCancel = () => {
    if (confirmDialog) {
      confirmDialog.onCancel?.();
      setConfirmDialog(null);
    }
  };

  const getIcon = (type: NotificationProps['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: NotificationProps['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-800';
      case 'error':
        return 'bg-red-900/20 border-red-800';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-800';
      case 'info':
        return 'bg-blue-900/20 border-blue-800';
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, showConfirm }}>
      {children}
      
      {/* Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`max-w-sm w-full ${getBgColor(notification.type)} border rounded-lg p-4 shadow-lg backdrop-blur-sm transform transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100">{notification.title}</p>
                {notification.message && (
                  <p className="text-sm text-zinc-300 mt-1">{notification.message}</p>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-zinc-100">{confirmDialog.title}</h3>
            </div>
            <p className="text-zinc-300 mb-6">{confirmDialog.message}</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

