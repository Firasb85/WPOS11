import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";

export interface EditField {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "select" | "date" | "textarea";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string>) => Promise<void>;
  title: string;
  fields: EditField[];
  initialData?: Record<string, string>;
}

export function EditModal({ isOpen, onClose, onSave, title, fields, initialData }: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({ ...initialData });
    } else if (isOpen) {
      setFormData({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  value={formData[field.key] || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                  required={field.required}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select...</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={formData[field.key] || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                  required={field.required}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={formData[field.key] || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
