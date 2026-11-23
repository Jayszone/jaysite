import Thumb from "./Thumb";
import { ChannelAv, Dur, Tag } from "./AppUI";
import { Icon } from "./Fig";
import type { Video } from "@/lib/sd/data";

// A phone running the same fictional "Watch" app as the laptop demo. The frame is deliberately
// plain (thin bezel, camera cut-out, no brand), so the comparison is Personal vs Shared Discovery,
// not one phone against another.
const NAV: [string, string][] = [["home", "Home"], ["compass", "Explore"], ["people", "Circles"], ["feed", "Library"]];

export function StatusBar() {
  return (
    <div className="ph-status" aria-hidden="true">
      <span>9:41</span>
      <span className="ph-cam" />
      <span className="ph-sys">
        <svg viewBox="0 0 18 12"><path d="M1 9h2v2H1zM5 7h2v4H5zM9 4.5h2V11H9zM13 2h2v9h-2z" /></svg>
        <svg viewBox="0 0 16 12"><path d="M8 10.2l1.7-1.8a2.4 2.4 0 0 0-3.4 0zM3.7 6.1a6 6 0 0 1 8.6 0l-1.1 1.2a4.4 4.4 0 0 0-6.4 0zM1.3 3.6a9.4 9.4 0 0 1 13.4 0l-1.1 1.2a7.8 7.8 0 0 0-11.2 0z" /></svg>
        <svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5" /><rect x="2" y="2" width="16" height="8" rx="1.8" /><path d="M23 4v4a2 2 0 0 0 0-4z" opacity=".5" /></svg>
      </span>
    </div>
  );
}

export function PhoneScreen({ shared, chips, videos, circle }: { shared: boolean; chips: string[]; videos: Video[]; circle?: string }) {
  return (
    <div className="ph-screen sd-app" data-mode={shared ? "shared" : "personal"}>
      <StatusBar />
      <div className="ph-top" aria-hidden="true">
        <span className="ui-brand"><i><Icon name="play" /></i>Watch</span>
        <span className="ph-mode">{shared ? <><Icon name="people" />{circle ?? "Shared Discovery"}</> : <><Icon name="lock" />Personal</>}</span>
        <Icon name="search" className="ph-ico" />
      </div>
      <div className="ph-chips" aria-hidden="true">{chips.map((c, i) => <span key={c} className={i === 0 ? "on" : ""}>{c}</span>)}</div>
      <div className="ph-feed" aria-hidden="true">
        {videos.map((v) => (
          <article className="ph-card" key={v.id}>
            <div className="ui-thumb"><Thumb video={v} /><Dur v={v} /></div>
            <div className="ph-meta">
              <ChannelAv name={v.channel} />
              <div>
                <p className="ui-title">{v.title}</p>
                <p className="ui-sub">{v.channel}</p>
                {shared && <Tag source="circle">From your circle</Tag>}
              </div>
            </div>
          </article>
        ))}
      </div>
      <nav className="ph-nav" aria-hidden="true">
        {NAV.map(([ic, l], i) => <span key={l} className={i === 0 ? "on" : ""}><Icon name={ic} />{l}</span>)}
      </nav>
      <span className="ph-home" aria-hidden="true" />
    </div>
  );
}

export function PhoneFrame({ children, label }: { children: React.ReactNode; label?: string }) {
  return <div className="phone" role="img" aria-label={label}>{children}</div>;
}
