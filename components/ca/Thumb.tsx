import "./ca.css";

// Work-index thumbnail for Claims & Appeals. Original artwork: a cited answer next to its source
// passage, on an ivory card with an orange arch. No photography and no third-party marks.
export default function CaThumb() {
  return (
    <div className="ca-th ca-canvas" role="img" aria-label="Human expertise, amplified by AI. A cited answer next to the source passage it points to.">
      <p className="ca-th-h" aria-hidden="true">Human expertise, amplified by AI.</p>
      <i className="ca-th-arch" aria-hidden="true" />
      <div className="ca-th-ans" aria-hidden="true">
        <b>Draft for analyst validation</b>
        <p><span>1</span>Use the network status on the date of service.</p>
        <p><span>2</span>Confirm the filing limit in effect on that date.</p>
      </div>
      <div className="ca-th-src" aria-hidden="true">
        <em>SOP-114 · v7 · section 4.2</em>
        <u /><mark>Network status is determined as of the date of service.</mark><u /><u className="s" />
      </div>
    </div>
  );
}
