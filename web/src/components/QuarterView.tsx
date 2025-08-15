"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuarter } from "@/lib/api";
import type { CalendarQuarter } from "@/types/calendar";

function MonthCard({ month }: { month: CalendarQuarter["months"][number] }) {
  return (
    <div className="card">
      <div className="font-semibold mb-3">
        {month.year}-{String(month.month).padStart(2, "0")}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1 text-sm text-[color:var(--muted)]">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>

        {month.weeks.map((w) => {
          const bg =
            w.highlight === "light" ? "bg-week-light text-week-light" :
            w.highlight === "dark"  ? "bg-week-dark  text-week-dark"  : "";
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
                const borderColor =
                  w.highlight === "dark" ? "border-white/25" : "border-black/20";
                return (
                  <div
                    key={day.date}
                    className={`min-h-16 rounded-lg text-sm px-2 py-1 border ${borderColor} ${day.inMonth ? "" : "opacity-60"} flex flex-col justify-between`}
                    style={{ background: "transparent" }}
                    title={day.isHoliday ? (day.holidayName ?? "Holiday") : ""}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        {day.date.split("-")[2]}
                      </span>
                      {day.isHoliday && <span aria-label="holiday" className="text-base">•</span>}
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
    </div>
  );
}

export default function QuarterView({ country, year, quarter }: { country: string; year: number; quarter: 1|2|3|4 }) {
  const { data, isLoading, error } = useQuery<CalendarQuarter>({
    queryKey: ["quarter", country, year, quarter],
    queryFn: () => getQuarter({ country, year, quarter }),
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading quarter…</div>;
  if (error) return <div className="text-red-400">{String(error)}</div>;
  if (!data) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Q{data.quarter} — {data.year}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {data.months.map((m) => (
          <MonthCard key={`${m.year}-${m.month}`} month={m} />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-5 text-sm text-[color:var(--muted)]">
        <div className="flex items-center gap-2">
          <span className="legend-dot" style={{ background: "var(--week-light)" }} />
          <span>1 holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="legend-dot" style={{ background: "var(--week-dark)" }} />
          <span>2+ holidays</span>
        </div>
      </div>
    </div>
  );
}