import toast from 'react-hot-toast';

export const showToast = (type, message, duration = 3000) => {
  switch (type) {
    case 'success':
      toast.success(message, { duration });
      break;
    case 'error':
      toast.error(message, { duration });
      break;
    case 'info':
      toast(message, { duration, icon: '💡' });
      break;
    case 'loading':
      return toast.loading(message, { duration: Infinity });
    default:
      toast(message, { duration });
  }
};

export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
}