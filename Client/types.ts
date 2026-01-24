
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}
