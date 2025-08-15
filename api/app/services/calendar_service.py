from __future__ import annotations
from datetime import date, timedelta
from typing import TypedDict, Dict, List, Tuple

class DayCell(TypedDict):
    date: str
    inMonth: bool
    isHoliday: bool
    holidayName: str | None

class WeekRow(TypedDict):
    isoYear: int
    isoWeek: int
    highlight: str  # "none"|"light"|"dark"
    days: List[DayCell]

class CalendarMonth(TypedDict):
    year: int
    month: int
    weeks: List[WeekRow]
    legend: Dict[str, str]

def _iso_week_start(d: date) -> date:
    # ISO week starts on Monday; isoweekday: Mon=1..Sun=7
    return d - timedelta(days=d.isoweekday() - 1)

def _iso_week_end(d: date) -> date:
    return _iso_week_start(d) + timedelta(days=6)

def _month_grid_bounds(year: int, month: int) -> tuple[date, date]:
    first = date(year, month, 1)
    # find last of month
    if month == 12:
        last = date(year, 12, 31)
    else:
        last = date(year, month + 1, 1) - timedelta(days=1)
    start = _iso_week_start(first)
    end = _iso_week_end(last)
    return start, end

def _daterange(d0: date, d1: date):
    cur = d0
    while cur <= d1:
        yield cur
        cur += timedelta(days=1)

def build_month_payload(year: int, month: int, holidays: list[dict]) -> CalendarMonth:
    start, end = _month_grid_bounds(year, month)
    holiday_map: Dict[str, str] = {h["date"]: h["name"] for h in holidays}
    weeks: Dict[tuple[int, int], List[date]] = {}

    for d in _daterange(start, end):
        iso = d.isocalendar()  # (iso_year, iso_week, iso_weekday)
        key = (iso[0], iso[1])
        weeks.setdefault(key, []).append(d)

    week_rows: List[WeekRow] = []
    for (iso_year, iso_week), days in sorted(weeks.items()):
        holiday_count = sum(1 for d in days if d.isoformat() in holiday_map)
        highlight = "none"
        if holiday_count == 1:
            highlight = "light"
        elif holiday_count >= 2:
            highlight = "dark"

        week_rows.append({
            "isoYear": iso_year,
            "isoWeek": iso_week,
            "highlight": highlight,
            "days": [{
                "date": d.isoformat(),
                "inMonth": (d.month == month),
                "isHoliday": d.isoformat() in holiday_map,
                "holidayName": holiday_map.get(d.isoformat())
            } for d in days]
        })

    return {
        "year": year,
        "month": month,
        "weeks": week_rows,
        "legend": {"light": "1 holiday", "dark": "2+ holidays"},
    }

def quarter_to_months(quarter: int) -> list[int]:
    if quarter not in (1,2,3,4):
        raise ValueError("quarter must be 1..4")
    start = (quarter - 1) * 3 + 1
    return [start, start+1, start+2]