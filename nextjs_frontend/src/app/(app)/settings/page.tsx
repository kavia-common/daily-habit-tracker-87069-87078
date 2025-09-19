export default function SettingsPage() {
  // PUBLIC_INTERFACE
  /** Minimal settings page placeholder. */
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account preferences. More options coming soon.
        </p>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-base font-medium text-gray-900">Appearance</h3>
        <p className="mt-1 text-sm text-gray-600">Theme: Ocean Professional</p>
      </section>
    </div>
  );
}
