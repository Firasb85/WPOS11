import { forwardRef } from "react";
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelAr?: string;
  error?: string;
  currentLang?: "ar" | "en";
  helperText?: string;
}
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, labelAr, error, currentLang = "ar", helperText, className = "", ...props }, ref) => {
    const isRtl = currentLang === "ar";
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRtl && labelAr ? labelAr : label}
            {props.required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2.5 rounded-lg border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${className}`}
          dir={isRtl ? "rtl" : "ltr"}
          {...props}
        />
        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
FormInput.displayName = "FormInput";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelAr?: string;
  error?: string;
  currentLang?: "ar" | "en";
  options: { value: string; label: string; labelAr?: string }[];
  placeholder?: string;
  placeholderAr?: string;
}
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      labelAr,
      error,
      currentLang = "ar",
      options,
      placeholder,
      placeholderAr,
      className = "",
      ...props
    },
    ref,
  ) => {
    const isRtl = currentLang === "ar";
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRtl && labelAr ? labelAr : label}
            {props.required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2.5 rounded-lg border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="">{isRtl && placeholderAr ? placeholderAr : placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {isRtl && opt.labelAr ? opt.labelAr : opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
FormSelect.displayName = "FormSelect";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelAr?: string;
  error?: string;
  currentLang?: "ar" | "en";
}
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, labelAr, error, currentLang = "ar", className = "", ...props }, ref) => {
    const isRtl = currentLang === "ar";
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRtl && labelAr ? labelAr : label}
            {props.required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-3 py-2.5 rounded-lg border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical min-h-[100px] ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
FormTextarea.displayName = "FormTextarea";
