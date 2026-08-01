'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader as Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  bucket: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  label?: string;
}

export default function ImageUpload({
  bucket,
  currentUrl,
  onUpload,
  onUploadingChange,
  label = 'Upload Image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl || '');
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const handleFile = async (file: File) => {
    if (!file || uploading) return;
    setUploading(true);
    setUploadError('');
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setPreview(data.publicUrl);
      onUpload(data.publicUrl);
    } else {
      setUploadError(error.message);
      console.error('Storage upload failed:', bucket, error);
    }
    setUploading(false);
  };

  return (
    <div>
      {label && <label className="block text-xs text-slate-500 mb-1.5">{label}</label>}
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-200"
        style={{ background: 'rgba(255,255,255,0.94)', border: '2px dashed rgba(15,23,42,0.16)', minHeight: 120 }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-slate-100/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                <Upload size={16} />
                Change
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setPreview(''); onUpload(''); }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-500 hover:text-white transition-colors"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            {uploading ? (
              <Loader2 size={24} className="animate-spin text-brand-orange" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
                  <ImageIcon size={18} className="text-brand-orange" />
                </div>
                <p className="text-slate-400 text-xs">Click to upload</p>
                <p className="text-slate-500 text-xs">PNG, JPG, WebP up to 5MB</p>
              </>
            )}
          </div>
        )}
        {uploading && preview && (
          <div className="absolute inset-0 bg-slate-100/85 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-brand-orange" />
          </div>
        )}
      </div>
      {uploadError && (
        <p className="text-red-500 text-xs mt-2 leading-relaxed">{uploadError}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

interface MultiImageUploadProps {
  bucket: string;
  currentUrls?: string[];
  onUpload: (urls: string[]) => void;
  label?: string;
}

export function MultiImageUpload({ bucket, currentUrls = [], onUpload, label = 'Upload Images' }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentUrls);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setUploadError('');
    const newUrls: string[] = [];
    let lastMsg = '';
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        newUrls.push(data.publicUrl);
      } else {
        lastMsg = error.message;
        console.error('Storage upload failed:', bucket, error);
      }
    }
    if (lastMsg && newUrls.length === 0) {
      setUploadError(lastMsg);
    } else if (lastMsg) {
      setUploadError(`Some files failed: ${lastMsg}`);
    }
    const updated = [...previews, ...newUrls];
    setPreviews(updated);
    onUpload(updated);
    setUploading(false);
  };

  const remove = (idx: number) => {
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    onUpload(updated);
  };

  return (
    <div>
      {label && <label className="block text-xs text-slate-500 mb-1.5">{label}</label>}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {previews.map((url, i) => (
          <div key={i} className="relative rounded-lg overflow-hidden aspect-video group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <div
          className="aspect-video rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all"
          style={{ background: 'rgba(255,255,255,0.94)', border: '2px dashed rgba(15,23,42,0.16)' }}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin text-brand-orange" />
          ) : (
            <>
              <Upload size={16} className="text-slate-400 mb-1" />
              <span className="text-slate-500 text-xs">Add</span>
            </>
          )}
        </div>
      </div>
      {uploadError && (
        <p className="text-red-500 text-xs mt-2 leading-relaxed">{uploadError}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); }}
      />
    </div>
  );
}
