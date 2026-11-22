// components/dashboard/profile-form.jsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/shared/image-upload';
import { cn } from '@/lib/utils';

/**
 * ProfileForm – reusable form for updating user profile.
 * Props:
 *   initialData: object containing the current user fields (name, email, phone, area, bio, image, role, plus technician extras)
 *   role: "customer" | "technician" | "admin"
 *   onSubmit: async (payload) => void – called with the updated fields when the form is submitted.
 */
export default function ProfileForm({ initialData = {}, role = 'customer', onSubmit }) {
  const [name, setName] = useState(initialData.name || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [area, setArea] = useState(initialData.area || '');
  const [bio, setBio] = useState(initialData.bio || '');
  const [image, setImage] = useState(initialData.image || '');
  // Technician‑only fields
  const [serviceArea, setServiceArea] = useState(initialData.serviceArea || '');
  const [skills, setSkills] = useState(initialData.skills || ''); // comma‑separated string
  const [experience, setExperience] = useState(initialData.experienceYears || '');

  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Detect dirty state – compare each field with initialData
  useEffect(() => {
    const isDirty =
      name !== (initialData.name || '') ||
      phone !== (initialData.phone || '') ||
      area !== (initialData.area || '') ||
      bio !== (initialData.bio || '') ||
      image !== (initialData.image || '') ||
      (role === 'technician' && (
        serviceArea !== (initialData.serviceArea || '') ||
        skills !== (initialData.skills || '') ||
        experience !== (initialData.experienceYears || '')
      ));
    setDirty(isDirty);
  }, [name, phone, area, bio, image, serviceArea, skills, experience, role, initialData]);

  const validate = () => {
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return false;
    }
    if (phone && !/^\+880\s?\d{1,3}\s?\d{3,4}\s?\d{4}$/.test(phone.trim())) {
      toast.error('Phone must be a valid Bangladesh number (e.g. +880 1XXX XXX XXX)');
      return false;
    }
    if (bio.length > 300) {
      toast.error('Bio must be 300 characters or fewer');
      return false;
    }
    if (role === 'technician') {
      if (experience && (Number(experience) <= 0 || isNaN(Number(experience)))) {
        toast.error('Years of experience must be a positive number');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
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
      if (role === 'technician') {
        payload.serviceArea = serviceArea.trim();
        payload.skills = skills.trim();
        payload.experienceYears = experience ? Number(experience) : undefined;
      }
      await onSubmit(payload);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6">
        <CardTitle className="text-xl font-semibold">Your profile</CardTitle>
        <span className="mt-2 sm:mt-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Profile photo */}
          <div>
            <Label>Profile photo</Label>
            <div className="mt-2 flex items-center space-x-4">
              <ImageUpload onUploaded={setImage} initialImage={image} />
              {image && (
                <img src={image} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Add 1 JPEG, PNG, WebP or GIF image. 5 MB maximum.
            </p>
          </div>
          {/* Basic fields */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" placeholder="+880 1XXX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="area">Address / Area</Label>
              <Input id="area" placeholder="City, district" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio">About you</Label>
              <Textarea
                id="bio"
                placeholder="A short introduction (optional)."
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {bio.length} / 300
              </p>
            </div>
          </div>
          {/* Technician‑only fields */}
          {role === 'technician' && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-4">
              <div>
                <Label htmlFor="serviceArea">Service area</Label>
                <Input id="serviceArea" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="skills">Skills / specialties</Label>
                <Input id="skills" placeholder="e.g. Phone, Laptop, TV" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="experience">Years of experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
            </div>
          )}
          {/* Footer submit */}
          <div className="flex items-center justify-end border-t border-border pt-4">
            <Button
              type="submit"
              disabled={saving || !dirty}
              className={cn('h-10 px-5 rounded-lg bg-primary text-primary-foreground', {
                'opacity-50 cursor-not-allowed': !dirty,
              })}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
