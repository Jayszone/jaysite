import "./ca.css";

// Work-index thumbnail for Claims & Appeals: the supplied photograph, with a short line in the white space.
export default function CaThumb() {
  return (
    <div className="ca-th">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/claims-appeals-thumb.jpg" alt="Two healthcare professionals smiling, in black and white against an orange shape" width={1658} height={1086} />
      <p className="ca-th-h">Human expertise, amplified by AI.</p>
    </div>
  );
}
