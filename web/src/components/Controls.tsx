"use client";

import type { Country } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/lib/api";

type Props = {
  country: string;
  setCountry: (c: string) => void;
  year: number;
  setYear: (y: number) => void;
  mode: "month" | "quarter";
  setMode: (m: "month" | "quarter") => void;
  month?: number;
  setMonth?: (m: number) => void;
  quarter?: 1 | 2 | 3 | 4;
  setQuarter?: (q: 1 | 2 | 3 | 4) => void;
};

export default function Controls(props: Props) {
  const { data: countries } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <select
        className="control min-w-[14rem]"
        value={props.country}
        onChange={(e) => props.setCountry(e.target.value)}
      >
        {countries?.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>

      <input
        type="number"
        className="control w-28"
        value={props.year}
        onChange={(e) => props.setYear(Number(e.target.value))}
      />

      <div className="inline-flex rounded-xl overflow-hidden">
        <button
          className={`btn-toggle ${props.mode === "month" ? "btn-toggle-active" : ""}`}
          onClick={() => props.setMode("month")}
        >
          Monthly
        </button>
        <button
          className={`btn-toggle ${props.mode === "quarter" ? "btn-toggle-active" : ""}`}
          onClick={() => props.setMode("quarter")}
        >
          Quarterly
        </button>
      </div>

      {props.mode === "month" && props.month && props.setMonth && (
        <select
          className="control"
          value={props.month}
          onChange={(e) => props.setMonth!(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      )}

      {props.mode === "quarter" && props.quarter && props.setQuarter && (
        <select
          className="control"
          value={props.quarter}
          onChange={(e) => props.setQuarter!(Number(e.target.value) as 1|2|3|4)}
        >
          {[1,2,3,4].map((q) => (
            <option key={q} value={q}>Q{q}</option>
          ))}
        </select>
      )}
    </div>
  );
}