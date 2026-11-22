'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ImageUpload({ onUploaded, disabled }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image is too large. Maximum size is 5MB.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json?.url) {
        setPreview(json.url);
        onUploaded?.(json.url);
      } else {
        setError(json?.error || 'Upload failed. Please try again.');
      }
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Input type="file" accept="image/*" onChange={handleFileChange} disabled={disabled || uploading} />
      {uploading ? <p className="text-xs text-muted-foreground">Uploading to ImgBB...</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {preview ? <img src={preview} alt="Uploaded preview" className="h-40 w-full rounded-lg object-cover" /> : null}
    </div>
  );
}

export default ImageUpload;
