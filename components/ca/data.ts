// Fictional example used by both interactive visuals. Nothing here is a real claim, member,
// procedure or rule. The documents and their text are invented for illustration.
export const CASE = {
  id: "CLM-20417783", reason: "Network status conflict", dos: "Mar 12, 2024", service: "Outpatient imaging",
  then: "In network", now: "Out of network", received: "Apr 29, 2024",
};

export type Para = { n: string; text: string };
export type Src = { id: string; title: string; type: string; pages: string; version: string; effective: string; updated: string; paras: Para[] };
export const SRC: Src[] = [
  { id: "SOP-114", title: "Network status on the date of service", type: "PDF", pages: "38 pp", version: "v7", effective: "Jan 15, 2024", updated: "Feb 2, 2024", paras: [
    { n: "4.1", text: "This procedure applies to professional and facility claims that fail the automated network check." },
    { n: "4.2", text: "Network status is determined as of the date of service. A provider who was participating on that date is processed at the participating rate, even if the participation agreement has since ended." },
    { n: "4.3", text: "If the provider file was corrected after the claim was received, reprocess the claim and note the correction in the case record." },
    { n: "4.4", text: "Record the date of service, the network status found, and the agreement used." } ] },
  { id: "SOP-118", title: "Timely filing limits", type: "DOCX", pages: "12 pp", version: "v4", effective: "Jul 1, 2023", updated: "Jul 12, 2023", paras: [
    { n: "2.1", text: "The filing limit that applies is the one in the provider's contract on the date of service. Claims received after the limit are denied unless an exception in section 2.4 applies." },
    { n: "2.2", text: "Count from the date of service to the date the claim was first received, not the date it was resubmitted." },
    { n: "2.4", text: "Coordination of benefits and retroactive eligibility changes may extend the limit." } ] },
  { id: "SOP-131", title: "Continuity of care", type: "PDF", pages: "21 pp", version: "v2", effective: "Sep 1, 2023", updated: "Sep 20, 2023", paras: [
    { n: "3.2", text: "Members receiving active treatment may qualify for continued access at in-network rates." },
    { n: "3.3", text: "When a participation agreement ends during an episode of care, route the claim to senior review before final processing." },
    { n: "3.4", text: "Senior review checks treatment dates, the member's condition, and whether a transition period was offered." } ] },
];

// [source index, paragraph index]
export type Cite = [number, number];
export type Step = { text: string; cite: Cite };
export const QUESTIONS: { q: string; short: string; steps: Step[] }[] = [
  { q: "The provider was in network on the date of service but is out of network now. Which rate applies?", short: "Which rate applies?", steps: [
    { text: "Use the provider's network status on the date of service. Here that means the participating rate.", cite: [0, 1] },
    { text: "Confirm the filing limit from the contract in effect on that date before you finalize.", cite: [1, 0] },
    { text: "If the agreement ended during treatment, send the claim to senior review first.", cite: [2, 1] } ] },
  { q: "Which filing limit applies to this claim, and how do I count it?", short: "Which filing limit applies?", steps: [
    { text: "Use the limit in the provider's contract on the date of service.", cite: [1, 0] },
    { text: "Count from the date of service to when the claim was first received, not when it was resubmitted.", cite: [1, 1] },
    { text: "Check whether a coordination-of-benefits exception extends the limit.", cite: [1, 2] } ] },
  { q: "Does this claim need senior review?", short: "Is senior review needed?", steps: [
    { text: "Yes, if the participation agreement ended during an episode of care.", cite: [2, 1] },
    { text: "Senior review checks treatment dates, the member's condition and any transition period.", cite: [2, 2] },
    { text: "If treatment had not started, the analyst can continue using the network status on the date of service.", cite: [0, 1] } ] },
];
export const OUTCOMES = {
  verified: { label: "Guidance verified", note: "The analyst confirmed the cited passages apply and continues the claim." },
  escalated: { label: "Escalate for senior review", note: "The claim goes to a senior reviewer with the cited passages attached." },
  info: { label: "More information needed", note: "The analyst asks for the missing detail before relying on the guidance." },
} as const;
export type OutcomeKey = keyof typeof OUTCOMES;
