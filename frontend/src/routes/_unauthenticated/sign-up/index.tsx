import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/auth-client';
import { Label } from '@radix-ui/react-dropdown-menu';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/_unauthenticated/sign-up/')({
  component: SignupPage,
});

// TODO: Implement zod to validate the form
function SignupPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents default form submission immediately

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    console.log('Loading...'); // Now this should print

    await signUp.email(
      {
        email,
        password,
        name,
        callbackURL: '/about',
      },
      {
        onRequest: (ctx) => {
          console.log('Loading...');
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of students to start your study journey
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Full name
              </Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700">
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
              <Label className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
