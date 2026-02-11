"use client";

export default function HealthcareMockup() {
  return (
    <div className="w-full h-full bg-[#f0fdf4] flex text-[10px]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar - Green/Medical theme */}
      <div className="w-[180px] bg-white border-r border-emerald-100 flex flex-col shrink-0">
        <div className="px-3 py-3 border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-[10px]">IQ</div>
            <div>
              <div className="text-gray-800 font-bold text-[10px]">IntakeIQ</div>
              <div className="text-gray-400 text-[7px]">Lakeside Dental</div>
            </div>
          </div>
        </div>
        <nav className="p-2 space-y-0.5 flex-1">
          {[
            { label: "Dashboard", icon: "📊", active: false },
            { label: "Schedule", icon: "📅", active: true },
            { label: "Patients", icon: "👥", active: false },
            { label: "Intake Forms", icon: "📋", active: false },
            { label: "Insurance", icon: "🛡️", active: false },
            { label: "Treatment Plans", icon: "🦷", active: false },
            { label: "Billing", icon: "💳", active: false },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] cursor-pointer ${item.active ? "bg-emerald-100 text-emerald-800 font-semibold" : "text-gray-500 hover:bg-gray-50"}`}>
              <span className="text-[10px]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div className="p-2 border-t border-emerald-100">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-700">DC</div>
            <div>
              <div className="text-gray-700 text-[9px] font-medium">Dr. Chen</div>
              <div className="text-gray-400 text-[7px]">Dentist</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="h-11 bg-white border-b border-emerald-100 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-800 font-semibold text-xs">Today&apos;s Schedule</span>
            <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[9px] font-medium">Feb 11, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button className="px-2 py-1 text-[8px] bg-emerald-600 text-white font-medium">Day</button>
              <button className="px-2 py-1 text-[8px] text-gray-500 bg-white">Week</button>
              <button className="px-2 py-1 text-[8px] text-gray-500 bg-white">Month</button>
            </div>
          </div>
        </div>

        <div className="p-4 flex gap-4">
          {/* Schedule Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
              {/* Time header */}
              <div className="grid grid-cols-[60px_1fr_1fr_1fr] border-b border-gray-100">
                <div className="p-1.5 bg-gray-50 text-[8px] text-gray-400 font-medium"></div>
                <div className="p-1.5 bg-gray-50 text-[8px] text-gray-600 font-semibold text-center border-l border-gray-100">Dr. Chen</div>
                <div className="p-1.5 bg-gray-50 text-[8px] text-gray-600 font-semibold text-center border-l border-gray-100">Dr. Patel</div>
                <div className="p-1.5 bg-gray-50 text-[8px] text-gray-600 font-semibold text-center border-l border-gray-100">Hygienist</div>
              </div>
              {/* Time slots */}
              {[
                {
                  time: "9:00", slots: [
                    { name: "Sarah M.", type: "Crown Prep", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                    { name: "James K.", type: "Filling", color: "bg-blue-50 border-blue-200 text-blue-700" },
                    { name: "Lisa R.", type: "Cleaning", color: "bg-purple-50 border-purple-200 text-purple-700" },
                  ]
                },
                {
                  time: "9:30", slots: [
                    { name: "", type: "", color: "" },
                    { name: "James K.", type: "cont.", color: "bg-blue-50 border-blue-200 text-blue-700" },
                    { name: "Mike T.", type: "Cleaning", color: "bg-purple-50 border-purple-200 text-purple-700" },
                  ]
                },
                {
                  time: "10:00", slots: [
                    { name: "David L.", type: "Root Canal", color: "bg-red-50 border-red-200 text-red-700" },
                    { name: "Amy W.", type: "Consult", color: "bg-amber-50 border-amber-200 text-amber-700" },
                    null,
                  ]
                },
                {
                  time: "10:30", slots: [
                    { name: "David L.", type: "cont.", color: "bg-red-50 border-red-200 text-red-700" },
                    { name: "Tom B.", type: "Extraction", color: "bg-orange-50 border-orange-200 text-orange-700" },
                    { name: "Karen S.", type: "Cleaning", color: "bg-purple-50 border-purple-200 text-purple-700" },
                  ]
                },
                {
                  time: "11:00", slots: [
                    { name: "Nina P.", type: "Exam", color: "bg-teal-50 border-teal-200 text-teal-700" },
                    { name: "Tom B.", type: "cont.", color: "bg-orange-50 border-orange-200 text-orange-700" },
                    { name: "Paul D.", type: "Cleaning", color: "bg-purple-50 border-purple-200 text-purple-700" },
                  ]
                },
              ].map((row) => (
                <div key={row.time} className="grid grid-cols-[60px_1fr_1fr_1fr] border-b border-gray-50">
                  <div className="p-1.5 text-[8px] text-gray-400 font-medium">{row.time}</div>
                  {row.slots.map((slot, i) => (
                    <div key={i} className="p-1 border-l border-gray-50">
                      {slot && slot.name ? (
                        <div className={`rounded-md border p-1.5 ${slot.color} h-full`}>
                          <div className="font-medium text-[8px]">{slot.name}</div>
                          <div className="text-[7px] opacity-70">{slot.type}</div>
                        </div>
                      ) : (
                        <div className="h-full rounded-md border border-dashed border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Next Patient */}
          <div className="w-[160px] space-y-3">
            <div className="bg-white rounded-xl border border-emerald-100 p-3">
              <div className="text-[8px] text-gray-400 font-medium uppercase tracking-wider mb-2">Up Next</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[10px]">SM</div>
                <div>
                  <div className="text-gray-800 font-semibold text-[10px]">Sarah Miller</div>
                  <div className="text-gray-400 text-[8px]">9:00 AM · Dr. Chen</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px]">
                  <span className="text-gray-400">Type</span>
                  <span className="text-gray-700 font-medium">Crown Prep</span>
                </div>
                <div className="flex justify-between text-[8px]">
                  <span className="text-gray-400">Insurance</span>
                  <span className="text-green-600 font-medium">Verified ✓</span>
                </div>
                <div className="flex justify-between text-[8px]">
                  <span className="text-gray-400">Intake</span>
                  <span className="text-green-600 font-medium">Complete ✓</span>
                </div>
                <div className="flex justify-between text-[8px]">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-gray-700 font-medium">$0.00</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-emerald-100 p-3">
              <div className="text-[8px] text-gray-400 font-medium uppercase tracking-wider mb-2">Today&apos;s Stats</div>
              <div className="space-y-2">
                {[
                  { label: "Appointments", value: "14", total: "/ 16" },
                  { label: "Checked In", value: "3", total: "" },
                  { label: "No Shows", value: "0", total: "" },
                  { label: "Revenue Est.", value: "$8,400", total: "" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-[8px]">
                    <span className="text-gray-400">{s.label}</span>
                    <span className="text-gray-700 font-semibold">{s.value}<span className="text-gray-300 font-normal">{s.total}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
