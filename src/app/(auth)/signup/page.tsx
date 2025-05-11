import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sigup-view';

export const metadata: Metadata = {
  title: 'Xác thực | đăng nhập',
  description: 'Mô tả thêm.'
};

export default function Page() {
  return <SignUpViewPage />;
}
