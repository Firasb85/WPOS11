import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { Save, X, Upload } from "lucide-react";
export const Route = createFileRoute("/_authenticated/evidence/new")({
  component: NewEvidencePage,
});
function NewEvidencePage() {
  return (
    <div>
      <PageHeader title="Submit Evidence" description="Submit new performance evidence" />
      <div className="max-w-2xl">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Employee *</label>
              <select className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm">
                <option>Select employee</option>
                <option>Ahmad Khalid</option>
                <option>Layla Ibrahim</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Evidence Type *</label>
              <select className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm">
                <option>Quantitative</option>
                <option>Qualitative</option>
                <option>Behavioral</option>
                <option>System Generated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Source *</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                placeholder="e.g., KPI Report, Supervisor Observation"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Date *</label>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Reliability</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="medium"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description *</label>
              <textarea
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm min-h-[80px]"
                placeholder="Describe the evidence"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">File (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Drag file here or click to upload</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              <Save className="w-4 h-4" />
              Submit Evidence
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
