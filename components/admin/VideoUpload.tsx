'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader as Loader2, Film } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

interface VideoUploadProps {
  bucket: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
  hint?: string;
}

export default function VideoUpload({
  bucket,
  currentUrl,
  onUpload,
  label = 'Upload Video',
  hint = 'MP4 or WebM, up to 100MB',
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setUploadError('File is too large. Maximum size is 100MB.');
      return;
    }
    setUploading(true);
    setUploadError('');
    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setFileName(file.name);
      onUpload(data.publicUrl);
    } else {
      setUploadError(error.message);
      console.error('Video upload failed:', bucket, error);
    }
    setUploading(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName('');
    onUpload('');
  };

  return (
    <div>
      {label && <label className="block text-xs text-slate-500 mb-1.5">{label}</label>}
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-200"
        style={{ background: 'rgba(255,255,255,0.94)', border: '2px dashed rgba(15,23,42,0.16)', minHeight: 100 }}
        onClick={() => inputRef.current?.click()}
      >
        {currentUrl ? (
          <div className="flex items-center gap-3 px-4 py-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}
            >
              <Film size={18} className="text-brand-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 text-sm font-medium truncate">
                {fileName || 'Video uploaded'}
              </p>
              <p className="text-slate-500 text-xs truncate">{currentUrl.split('/').pop()}</p>
            </div>
            <button
              type="button"
              onClick={clear}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-500 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-7 gap-2">
            {uploading ? (
              <Loader2 size={24} className="animate-spin text-brand-orange" />
            ) : (
              <>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}
                >
                  <Upload size={18} className="text-brand-orange" />
                </div>
                <p className="text-slate-400 text-xs">Click to upload video</p>
                <p className="text-slate-500 text-xs">{hint}</p>
              </>
            )}
          </div>
        )}
        {uploading && currentUrl && (
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
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
