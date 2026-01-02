import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

export const FeedbackToast: React.FC = () => {
  const { feedback, clearFeedback } = useInventoryStore();

  useEffect(() => {
    if (feedback.type && feedback.type !== 'system') {
      const timer = setTimeout(clearFeedback, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback, clearFeedback]);

  if (!feedback.type) return null;

  const styles = {
    system: 'bg-adv-error text-white',
    workflow: 'bg-adv-warning text-black',
    success: 'bg-adv-success text-white',
  };

  const icons = {
    system: <XCircle className="w-6 h-6 mr-3" />,
    workflow: <AlertTriangle className="w-6 h-6 mr-3" />,
    success: <CheckCircle className="w-6 h-6 mr-3" />,
  };

  return (
    <div 
      role="alert"
      className={clsx(
        'fixed bottom-0 left-0 right-0 p-4 shadow-lg transition-transform transform translate-y-0 flex items-center justify-center min-h-[80px] z-50',
        styles[feedback.type]
      )}
    >
      {icons[feedback.type]}
      <span className="text-lg font-medium">{feedback.message}</span>
    </div>
  );
};