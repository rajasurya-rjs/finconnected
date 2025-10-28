import React from 'react';
const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';
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

export default function SignupPage() {
  const [, navigate] = useLocation();
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Signup failed');
      }
      const json = await res.json();
      if (json.token) {
        // store token in localStorage for client-side requests (server also sets httpOnly cookie)
        try { localStorage.setItem('token', json.token); } catch (e) { /* ignore */ }
        try { queryClient.setQueryData(['/api/auth/me'], json.user); } catch (e) { }
        navigate('/');
      } else {
        alert('Signup failed');
      }
    } catch (err: any) {
      alert(err.message || 'Signup error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card border border-card-border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create account</h2>
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
              Already have an account? <a href="/login" className="text-primary underline">Login</a>
            </div>
            <div>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Creating...' : 'Create account'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
