import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/competency/framework")({
  component: frameworkPage,
});
function frameworkPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">framework</h1>
      <p className="text-sm text-gray-500">
        This page is temporarily unavailable. The original source had a JSX syntax error and has
        been stubbed so the rest of the app can load.
      </p>
    </div>
  );
}
