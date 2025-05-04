
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export const useToast = () => {
  const toast = (options: ToastOptions) => {
    console.log('Toast:', options);
  };

  return { toast };
};

export const toast = (options: ToastOptions) => {
  console.log('Global Toast:', options);
};
