"use client";
import { useEffect, useState } from "react";

function mood(h: number) {
  if (h < 6) return "most likely asleep.";
  if (h < 9) return "probably making coffee.";
  if (h < 18) return "probably building something.";
  if (h < 23) return "probably reading something.";
  return "winding down.";
}

export default function Footer({ name, timezone, place }: { name: string; timezone: string; place: string }) {
  const [line, setLine] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hour = +new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", hourCycle: "h23" }).format(d);
      const time = new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", minute: "2-digit" }).format(d).toLowerCase();
      setLine(`${time}${place ? ` in ${place}` : ""}, ${mood(hour)}`);
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, [timezone, place]);
  return (
    <footer className="ftr">
      <div className="col ftr-in">
        <p>© {new Date().getFullYear()} {name}</p>
        <p className="r mute" aria-live="off" data-tz={timezone} data-place={place}>{line}</p>
      </div>
    </footer>
  );
}
