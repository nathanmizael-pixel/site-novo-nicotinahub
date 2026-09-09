import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-600 uppercase tracking-wider text-text-muted mb-1.5">{label}</label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-abyss border rounded-md text-text placeholder:text-text-dim text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-glow-sm outline-none ${error ? 'border-danger/50' : 'border-border'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-600 uppercase tracking-wider text-text-muted mb-1.5">{label}</label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-abyss border rounded-md text-text placeholder:text-text-dim text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-glow-sm outline-none resize-none ${error ? 'border-danger/50' : 'border-border'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
