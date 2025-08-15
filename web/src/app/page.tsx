"use client";

import { useState } from "react";
import Controls from "@/components/Controls";
import MonthView from "@/components/MonthView";
import QuarterView from "@/components/QuarterView";

export default function Home() {
  const now = new Date();
  const [country, setCountry] = useState("US");
  const [year, setYear] = useState(now.getFullYear());
  const [mode, setMode] = useState<"month" | "quarter">("month");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [quarter, setQuarter] = useState<1|2|3|4>(((now.getMonth())/3 | 0) + 1 as 1|2|3|4);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300">
    Vacation Calendar
  </span>
</h1>

      <Controls
        country={country} setCountry={setCountry}
        year={year} setYear={setYear}
        mode={mode} setMode={setMode}
        month={month} setMonth={setMonth}
        quarter={quarter} setQuarter={setQuarter}
      />

      {mode === "month" ? (
        <MonthView country={country} year={year} month={month} />
      ) : (
        <QuarterView country={country} year={year} quarter={quarter} />
      )}
    </main>
  );
}