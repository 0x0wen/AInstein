import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { signIn } from '@/lib/auth-client';

export const Route = createFileRoute('/_unauthenticated/login/')({
  component: LoginPage,
});

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: 'http://localhost:5173',
        errorCallbackURL: '/error',
        newUserCallbackURL: '/study-kit',
      });
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
        rememberMe: false,
      });

      if (error) {
        console.error('Sign-in failed:', error);
        alert('Sign-in failed. Please check your credentials.');
      } else {
        console.log('Sign-in successful:', data);
        alert('Sign-in successful!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await handleEmailSignIn(email, password);
  };

  return (
    <div className="flex min-h-screen items-center min-w-screen justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to your study dashboard
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            variant="outline"
            className="w-full justify-center gap-2"
            size="lg"
            onClick={handleGoogleSignIn}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <title>Google</title>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/sign-up"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
