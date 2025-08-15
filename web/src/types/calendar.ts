export type DayCell = {
    date: string;          // YYYY-MM-DD
    inMonth: boolean;
    isHoliday: boolean;
    holidayName: string | null;
  };
  
  export type WeekRow = {
    isoYear: number;
    isoWeek: number;
    highlight: "none" | "light" | "dark";
    days: DayCell[];
  };
  
  export type CalendarMonth = {
    year: number;
    month: number; // 1..12
    weeks: WeekRow[];
    legend: { light: string; dark: string };
  };
  
  export type CalendarQuarter = {
    year: number;
    quarter: 1 | 2 | 3 | 4;
    months: CalendarMonth[];
  };