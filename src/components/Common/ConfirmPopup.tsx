import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <AlertCircle className="text-red-500" size={32} />,
      button: 'bg-red-500 hover:bg-red-600 shadow-red-200',
      border: 'border-red-100'
    },
    warning: {
      icon: <AlertCircle className="text-orange-500" size={32} />,
      button: 'bg-orange-500 hover:bg-orange-600 shadow-orange-200',
      border: 'border-orange-100'
    },
    info: {
      icon: <AlertCircle className="text-blue-500" size={32} />,
      button: 'bg-blue-500 hover:bg-blue-600 shadow-blue-200',
      border: 'border-blue-100'
    }
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full bg-opacity-10 ${variant === 'danger' ? 'bg-red-50' : variant === 'warning' ? 'bg-orange-50' : 'bg-blue-50'}`}>
              {style.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{title}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{variant} ACTION</p>
            </div>
            <button 
              onClick={onCancel}
              className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className={`p-4 rounded-xl border-2 ${style.border} bg-gray-50/50 mb-6`}>
            <p className="text-gray-700 font-bold leading-relaxed">{message}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-black uppercase tracking-wider hover:bg-gray-50 transition-all active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-black uppercase tracking-wider shadow-lg transition-all active:scale-95 ${style.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
