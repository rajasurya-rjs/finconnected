import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';

type FormValues = {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
};

export default function ProfilePage() {
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();
  const qc = useQueryClient();

  // load current user from cache
  const user = qc.getQueryData<any>(['/api/auth/me']);

  React.useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName || '', lastName: user.lastName || '', profileImageUrl: user.profileImageUrl || '' });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Update failed');
      }
      const json = await res.json();
      qc.setQueryData(['/api/auth/me'], json);
      alert('Profile updated');
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    }
  };

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card border border-card-border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">First name</label>
          <Input {...register('firstName')} defaultValue={user.firstName || ''} />
        </div>
        <div>
          <label className="block text-sm mb-1">Last name</label>
          <Input {...register('lastName')} defaultValue={user.lastName || ''} />
        </div>
        <div>
          <label className="block text-sm mb-1">Profile image URL</label>
          <Input {...register('profileImageUrl')} defaultValue={user.profileImageUrl || ''} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>Save</Button>
        </div>
      </form>
    </div>
  );
}
