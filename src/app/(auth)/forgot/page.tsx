import { Metadata } from 'next';
import ForgotPassword from '@/features/auth/components/forgot-password';
export const metadata: Metadata = {
  title: 'Quên mật khẩu',
  description: 'Sử dụng khi quên mật khẩu.'
};

export default function Page() {
  return <ForgotPassword />;
}
