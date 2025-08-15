"use client";

import type { CalendarMonth } from "@/types/calendar";

export default function CalendarGrid({ data }: { data: CalendarMonth }) {
  return (
    <div className="space-y-1">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="text-sm font-medium text-center">{d}</div>
        ))}
      </div>

      {/* Weeks */}
      {data.weeks.map((w) => (
        <div
          key={`${w.isoYear}-${w.isoWeek}`}
          className="grid grid-cols-7 gap-1 rounded p-1"
          style={{
            background:
              w.highlight === "light" ? "#E7F6E7" :
              w.highlight === "dark" ? "#C7EAC7" : "transparent",
          }}
        >
          {w.days.map((day) => (
            <div
              key={day.date}
              title={day.isHoliday ? (day.holidayName ?? "Holiday") : ""}
              className={`border min-h-16 p-1 text-sm rounded ${day.inMonth ? "" : "text-gray-400 bg-gray-50"}`}
            >
              <div className="flex items-center justify-between">
                <span>{day.date.split("-")[2]}</span>
                {day.isHoliday && <span aria-label="holiday">•</span>}
              </div>
              {day.isHoliday && day.holidayName && (
                <div className="mt-1 text-xs">{day.holidayName}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}