export default function DashboardPage() {
  // PUBLIC_INTERFACE
  /** Minimal dashboard page placeholder following minimalist design. */
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Today</h2>
        <p className="mt-1 text-sm text-gray-600">
          Start building your habit streaks. Add a habit and check in daily.
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">Your Habits</h3>
          <button
            className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            aria-label="Add habit"
          >
            + Add
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">Sample Habit</p>
              <span className="text-xs text-gray-500">Streak: 0</span>
            </div>
            <button className="mt-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Check in
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
