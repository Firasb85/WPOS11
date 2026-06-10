interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
  accent?: "blue" | "green" | "red" | "yellow" | "purple" | "none";
}

const paddingStyles = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };

const accentStyles = {
  none: "",
  blue: "border-t-2 border-t-blue-600",
  green: "border-t-2 border-t-emerald-600",
  red: "border-t-2 border-t-red-600",
  yellow: "border-t-2 border-t-amber-500",
  purple: "border-t-2 border-t-purple-600",
};

export function Card({ children, className = "", padding = "md", accent = "none", ...props }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${accentStyles[accent]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-sm font-semibold text-gray-800 dark:text-gray-100 uppercase tracking-wide flex items-center gap-2 ${className}`}>
      {children}
    </h3>
  );
}
