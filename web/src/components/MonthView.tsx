"use client";

import { useQuery } from "@tanstack/react-query";
import { getMonth } from "@/lib/api";
import type { CalendarMonth } from "@/types/calendar";

function Legend() {
  return (
    <div className="flex items-center gap-4 mt-4 text-sm text-[color:var(--muted)]">
      <div className="flex items-center gap-2">
        <span className="legend-dot" style={{ background: "var(--week-light)" }} />
        <span>1 holiday</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="legend-dot" style={{ background: "var(--week-dark)" }} />
        <span>2+ holidays</span>
      </div>
    </div>
  );
}

function CalendarGrid({ data }: { data: CalendarMonth }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-sm text-[color:var(--muted)]">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      {data.weeks.map((w) => {
        const bg =
          w.highlight === "light" ? "bg-week-light text-week-light" :
          w.highlight === "dark"  ? "bg-week-dark  text-week-dark"  : "";

        // text color classes tied to week
        const textClass =
          w.highlight === "light" ? "text-week-light" :
          w.highlight === "dark"  ? "text-week-dark"  : "";

        return (
          <div
            key={`${w.isoYear}-${w.isoWeek}`}
            className={`grid grid-cols-7 gap-1 rounded-xl p-1 ${bg} ${textClass}`}
            style={{ transition: "background 180ms ease, color 180ms ease" }}
          >
            {w.days.map((day) => {
              const dayBase =
                "min-h-16 rounded-lg text-sm px-2 py-1 border flex flex-col justify-between";
              const muted = day.inMonth ? "" : "opacity-60";
              const borderColor =
                w.highlight === "dark" ? "border-white/25" : "border-black/20";

              // transparent card so week color shows through
              return (
                <div
                  key={day.date}
                  title={day.isHoliday ? (day.holidayName ?? "Holiday") : ""}
                  className={`${dayBase} ${muted} ${borderColor}`}
                  style={{ background: "transparent" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {day.date.split("-")[2]}
                    </span>
                    {day.isHoliday && (
                      <span
                        aria-label="holiday"
                        className="text-base"
                        style={{ lineHeight: 1 }}
                      >
                        •
                      </span>
                    )}
                  </div>

                  {day.isHoliday && day.holidayName && (
                    <div
                      className="mt-1 text-[11px] leading-tight rounded-md px-1 py-[2px]"
                      style={{
                        background:
                          w.highlight === "dark"
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(0,0,0,0.08)",
                      }}
                    >
                      {day.holidayName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function MonthView({ country, year, month }: { country: string; year: number; month: number }) {
  const { data, isLoading, error } = useQuery<CalendarMonth>({
    queryKey: ["month", country, year, month],
    queryFn: () => getMonth({ country, year, month }),
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading month…</div>;
  if (error) return <div className="text-red-400">{String(error)}</div>;
  if (!data) return null;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">{data.year}-{String(data.month).padStart(2, "0")}</h2>
      <CalendarGrid data={data} />
      <Legend />
    </div>
  );
}