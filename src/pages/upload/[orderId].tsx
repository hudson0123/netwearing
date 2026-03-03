import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import Link from 'next/link';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadPage() {
  const router = useRouter();
  const { orderId } = router.query;

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');

  const validateFile = useCallback((f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return 'Please upload a PDF or Word document. We know your résumé deserves better than a JPEG.';
    }
    if (f.size > MAX_SIZE) {
      return 'File must be under 10MB. Even your most impressive career should fit.';
    }
    return null;
  }, []);

  function handleFileDrop(e: DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
      setError('');
      setFile(f);
    }
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
      setError('');
      setFile(f);
    }
  }

  async function handleUpload() {
    if (!file || !orderId) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', orderId as string);

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploaded(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  if (uploaded) {
    return (
      <>
        <Head>
          <title>Qualifications Received — Netwearing™</title>
        </Head>
        <div className="min-h-screen bg-bg py-12 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#057642" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
              Your qualifications have been received.
            </h1>
            <p className="text-muted text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Our team will review your résumé and send you a shirt mockup within
              48 hours. We actually follow up. Shocking, we know.
            </p>
            <Link
              href="/"
              className="inline-block bg-linkedin-blue text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-linkedin-dark transition-all hover:-translate-y-0.5"
            >
              Back to Netwearing →
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Upload Résumé — Netwearing™</title>
      </Head>

      <div className="min-h-screen bg-bg py-12 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-linkedin-blue uppercase tracking-wide bg-linkedin-light px-3 py-1 rounded-full mb-3">
              Final Step
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
              Attach Your Qualifications
            </h1>
            <p className="text-sm text-muted">
              Upload your résumé. PDF or Word. We promise to actually read it.
            </p>
          </div>

          {/* Upload zone */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-linkedin-blue bg-linkedin-light/30'
                  : 'border-border hover:border-linkedin-blue/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
              />

              {file ? (
                <div>
                  <div className="w-12 h-12 bg-linkedin-light rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-text">{file.name}</p>
                  <p className="text-xs text-muted mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 bg-bg rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-text mb-1">
                    Drop your résumé here
                  </p>
                  <p className="text-xs text-muted">
                    PDF or Word · 10MB max · Drag and drop or click to browse
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red/10 text-red text-sm px-4 py-3 rounded-lg mt-4">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full mt-4 bg-linkedin-blue text-white py-3.5 rounded-full font-semibold text-sm hover:bg-linkedin-dark transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {uploading ? 'Uploading...' : 'Submit Qualifications →'}
            </button>

            <p className="text-center text-xs text-muted mt-3">
              Your résumé will be used exclusively for shirt printing. No recruiters
              will ghost you as a result of this upload.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
