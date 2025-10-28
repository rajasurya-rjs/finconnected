import React from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { queryClient } from '@/lib/queryClient';

type FormValues = {
  email: string;
  firstName?: string;
  lastName?: string;
};

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Login failed');
      }
      const json = await res.json();
      if (json.token) {
        localStorage.setItem('token', json.token);
        // update react-query cache for auth immediately so router can switch to dashboard
        try {
          queryClient.setQueryData(['/api/auth/me'], json.user);
        } catch (e) {
          // ignore if query client not available
        }
        // navigate to root which will re-evaluate auth state
        navigate('/');
      } else {
        alert('Login failed');
      }
    } catch (err: any) {
      alert(err.message || 'Login error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card border border-card-border rounded-lg">
  <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input {...register('email', { required: true })} type="email" />
          </div>
          <div>
            <label className="block text-sm mb-1">First name (optional)</label>
            <Input {...register('firstName')} />
          </div>
          <div>
            <label className="block text-sm mb-1">Last name (optional)</label>
            <Input {...register('lastName')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Don't have an account? <a href="/signup" className="text-primary underline">Sign up</a>
            </div>
            <div>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
