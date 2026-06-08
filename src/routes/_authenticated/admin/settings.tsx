import { createFileRoute } from "@tanstack/react-router";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ForbiddenPage } from "@/components/errors/ForbiddenPage";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { Save } from "lucide-react";
import { useCeoDashboard } from "@/hooks/useDashboard";
export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsPage });
function SettingsPage() {
  const { data: metrics, isLoading: _metricsLoading } = useCeoDashboard();
  return (
    <PermissionGuard allowedRoles={["ADMIN", "CEO"]} fallback={<ForbiddenPage />}>
      <div>
        <PageHeader title="System Settings" description="Configure system preferences" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">System Name</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="WPOS - Workforce Performance Operating System"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">System Email</label>
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="admin@wpos.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Default Language</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="ar"
                >
                  <option value="ar">Arabic</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Default Theme</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="light"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Settings</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Confidence Threshold</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="70"
                >
                  <option value="60">60%</option>
                  <option value="70">70%</option>
                  <option value="80">80%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Max Hypotheses</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="3"
                >
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Evidence Reliability Min</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="medium"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {["Email Notifications", "Critical KPI Alerts", "Report Review Notifications"].map(
                (n) => (
                  <div key={n} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{n}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ),
              )}
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Password Policy</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="strong"
                >
                  <option value="standard">Standard</option>
                  <option value="strong">Strong</option>
                  <option value="very_strong">Very Strong</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Session Duration</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  defaultValue="24"
                >
                  <option value="8">8 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="72">72 Hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Two-Factor Auth</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </PermissionGuard>
  );
}
