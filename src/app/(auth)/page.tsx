import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import LanguageSelector from '@/components/common/language-selector';
import LoginCard from '@/components/auth/login-card';

export default async function AuthHome() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="xl:padding-l wide:padding-r padding-b flex min-h-screen w-full items-center justify-center bg-primary">
        <div className="flex w-full max-w-[1440px] flex-col items-center gap-8 px-4 py-8 max-sm:mt-12">
          <LanguageSelector />
          <LoginCard />
        </div>
      </main>
    );
  }

  return redirect('/home');
}
