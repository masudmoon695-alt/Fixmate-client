'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch, ApiError } from '@/lib/api';
import { useSession, authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Plus, Loader2, X, Pencil } from 'lucide-react';
import Image from 'next/image';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [skills, setSkills] = useState('');

  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const initRef = useRef(null);

  // Populate fields once session is ready
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.replace('/sign-in?redirect=/dashboard/profile');
      return;
    }
    const u = session.user;
    setName(u.name ?? '');
    setEmail(u.email ?? '');
    setPhone(u.phone ?? '');
    setArea(u.area ?? '');
    setBio(u.bio ?? '');
    setImage(u.image ?? '');
    setServiceArea(u.serviceArea ?? '');
    setSkills(u.skills ?? '');
    initRef.current = {
      name: u.name ?? '',
      phone: u.phone ?? '',
      area: u.area ?? '',
      bio: u.bio ?? '',
      image: u.image ?? '',
      serviceArea: u.serviceArea ?? '',
      skills: u.skills ?? '',
    };
    setLoaded(true);
  }, [session, status, router]);

  // Dirty detection
  useEffect(() => {
    if (!loaded || !initRef.current) return;
    const i = initRef.current;
    setDirty(
      name !== i.name ||
      phone !== i.phone ||
      area !== i.area ||
      bio !== i.bio ||
      image !== i.image ||
      serviceArea !== i.serviceArea ||
      skills !== i.skills
    );
  }, [name, phone, area, bio, image, serviceArea, skills, loaded]);

  // --- Image upload ---
  async function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP and GIF images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: 'POST', body: formData }
      );
      const json = await res.json();
      if (json?.data?.url) {
        setImage(json.data.url);
        toast.success('Image uploaded');
      } else {
        toast.error('Image upload failed');
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeImage() {
    setImage('');
  }

  // --- Validation ---
  function validate() {
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return false;
    }
    if (phone && !/^\+?880\s?\d{4,5}\s?\d{3,6}$/.test(phone.trim())) {
      toast.error('Enter a valid Bangladesh phone number (e.g. +880 1XXX XXXXXX)');
      return false;
    }
    if (bio.length > 300) {
      toast.error('Bio must be 300 characters or fewer');
      return false;
    }
    return true;
  }

  // --- Save ---
  async function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        area: area.trim(),
        bio: bio.trim(),
        image,
      };
      const json = await apiFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      toast.success(json?.message || 'Profile updated');
      await authClient.getSession();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  // --- Skeleton while loading ---
  if (!loaded) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </section>
    );
  }

  const role = session?.user?.role ?? 'customer';
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const subtitleMap = {
    customer: 'Keep your contact details current so technicians can reach you.',
    technician: 'Keep your details and service area current so customers can trust and reach you.',
    admin: 'Manage your administrator account details.',
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
          ACCOUNT SETTINGS
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Profile settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          {subtitleMap[role] || subtitleMap.customer}
        </p>
      </div>

      {/* Main card */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 md:p-8 pb-0 md:pb-0">
          <CardTitle className="text-xl font-semibold text-foreground">Your profile</CardTitle>
          <span className="mt-2 sm:mt-0 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {roleLabel}
          </span>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* ---- Profile photo ---- */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-1.5 block">
                Profile photo
              </Label>

              <div className="mt-2 flex items-center gap-4">
                {image ? (
                  <div className="relative h-24 w-24 shrink-0">
                    <img
                      src={image}
                      alt="Profile"
                      className="h-24 w-24 rounded-xl object-cover border border-border"
                    />
                    <div className="absolute -bottom-1 -right-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Change"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 hover:bg-muted transition-colors cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Plus className="h-5 w-5 text-muted-foreground" />
                        <span className="mt-1 text-xs text-muted-foreground">Add image</span>
                      </>
                    )}
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Add 1 JPEG, PNG, WebP or GIF image. 5 MB maximum.
              </p>
            </div>

            {/* ---- Fields grid ---- */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Full name */}
              <div>
                <Label htmlFor="profile-name" className="text-sm font-medium text-foreground mb-1.5 block">
                  Full name
                </Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Email (disabled) */}
              <div>
                <Label htmlFor="profile-email" className="text-sm font-medium text-foreground mb-1.5 block">
                  Email address
                </Label>
                <Input
                  id="profile-email"
                  value={email}
                  disabled
                  className="h-11 rounded-lg border border-input bg-muted px-3 text-muted-foreground cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Contact support if you need to change your email.
                </p>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="profile-phone" className="text-sm font-medium text-foreground mb-1.5 block">
                  Phone number
                </Label>
                <Input
                  id="profile-phone"
                  placeholder="+880 1XXX-XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Address (full width) */}
              <div className="md:col-span-2">
                <Label htmlFor="profile-area" className="text-sm font-medium text-foreground mb-1.5 block">
                  Address / Area
                </Label>
                <Input
                  id="profile-area"
                  placeholder="City, district"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-11 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Bio (full width) */}
              <div className="md:col-span-2">
                <Label htmlFor="profile-bio" className="text-sm font-medium text-foreground mb-1.5 block">
                  About you
                </Label>
                <Textarea
                  id="profile-bio"
                  placeholder="A short introduction (optional)."
                  maxLength={300}
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="resize-none rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {bio.length} / 300
                </p>
              </div>

              {/* Technician-only fields */}
              {role === 'technician' && (
                <>
                  <div>
                    <Label htmlFor="profile-service-area" className="text-sm font-medium text-foreground mb-1.5 block">
                      Service area
                    </Label>
                    <Input
                      id="profile-service-area"
                      value={serviceArea}
                      onChange={(e) => setServiceArea(e.target.value)}
                      className="h-11 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-skills" className="text-sm font-medium text-foreground mb-1.5 block">
                      Skills / specialties
                    </Label>
                    <Input
                      id="profile-skills"
                      placeholder="e.g. Phone, Laptop, TV"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="h-11 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </>
              )}
            </div>

            {/* ---- Footer ---- */}
            <div className="border-t border-border pt-5 flex justify-end">
              <Button
                type="submit"
                disabled={saving || !dirty}
                className="h-10 px-5 rounded-lg bg-primary text-primary-foreground inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
