"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  initialDays?: number;
  initialHours?: number;
  initialMinutes?: number;
  targetDate?: string; // e.g. "2027-01-01T00:00:00Z"
}

export function WaitlistCountdown({
  initialDays = 108,
  initialHours = 5,
  initialMinutes = 20,
  targetDate,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
  }>({
    days: String(initialDays).padStart(2, "0"),
    hours: String(initialHours).padStart(2, "0"),
    minutes: String(initialMinutes).padStart(2, "0"),
  });

  useEffect(() => {
    if (!targetDate) return;

    function updateTimer() {
      const target = new Date(targetDate!).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00" });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
      });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-6 sm:gap-10 md:gap-16 my-2 sm:my-4">
      <div className="flex flex-col items-center gap-2 sm:gap-4">
        <div className="text-center font-display text-[64px] sm:text-[90px] md:text-[128px] font-normal leading-[0.9] tracking-[-0.02em] bg-gradient-to-b from-[#E8F0FF] to-[#82AEFF] bg-clip-text text-transparent">
          {timeLeft.days}
        </div>
        <div className="font-display text-base sm:text-xl md:text-2xl text-[#82AEFF] uppercase tracking-wider">
          DAYS
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 sm:gap-4">
        <div className="text-center font-display text-[64px] sm:text-[90px] md:text-[128px] font-normal leading-[0.9] tracking-[-0.02em] bg-gradient-to-b from-[#E8F0FF] to-[#82AEFF] bg-clip-text text-transparent">
          {timeLeft.hours}
        </div>
        <div className="font-display text-base sm:text-xl md:text-2xl text-[#82AEFF] uppercase tracking-wider">
          HOURS
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 sm:gap-4">
        <div className="text-center font-display text-[64px] sm:text-[90px] md:text-[128px] font-normal leading-[0.9] tracking-[-0.02em] bg-gradient-to-b from-[#E8F0FF] to-[#82AEFF] bg-clip-text text-transparent">
          {timeLeft.minutes}
        </div>
        <div className="font-display text-base sm:text-xl md:text-2xl text-[#82AEFF] uppercase tracking-wider">
          MINUTES
        </div>
      </div>
    </div>
  );
}
