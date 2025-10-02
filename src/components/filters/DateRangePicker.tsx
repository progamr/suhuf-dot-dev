'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  dateFrom: Date | null;
  dateTo: Date | null;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DateRangePickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">From Date</label>
        <div className="relative">
          <DatePicker
            selected={dateFrom}
            onChange={onDateFromChange}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            maxDate={dateTo || new Date()}
            placeholderText="Select start date"
            dateFormat="MMM d, yyyy"
            className="w-full px-3 py-2 pl-10 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            wrapperClassName="w-full"
            calendarClassName="shadow-lg border border-border"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">To Date</label>
        <div className="relative">
          <DatePicker
            selected={dateTo}
            onChange={onDateToChange}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            minDate={dateFrom}
            maxDate={new Date()}
            placeholderText="Select end date"
            dateFormat="MMM d, yyyy"
            className="w-full px-3 py-2 pl-10 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            wrapperClassName="w-full"
            calendarClassName="shadow-lg border border-border"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
