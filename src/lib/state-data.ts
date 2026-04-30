// All state filing data — stored server-side only, not exposed to the frontend.
// URLs are kept for future use (server-side redirects, emails, etc.).

export interface StateFilingData {
  fee: string;
  time: string;
  filingUrl: string;
  notes?: string;
}

export const STATE_FILING_DATA: Record<string, StateFilingData> = {
  "Alabama":        { fee: "$200", time: "1–2 weeks",    filingUrl: "https://www.sos.alabama.gov/business-entities/llc" },
  "Alaska":         { fee: "$250", time: "10–15 days",   filingUrl: "https://www.commerce.alaska.gov/web/cbpl/BusinessLicensing.aspx" },
  "Arizona":        { fee: "$50",  time: "14–16 days",   filingUrl: "https://ecorp.azcc.gov" },
  "Arkansas":       { fee: "$45",  time: "3–5 days",     filingUrl: "https://www.sos.arkansas.gov/business-commercial-services-bcs" },
  "California":     { fee: "$70",  time: "3–5 days",     filingUrl: "https://bizfileonline.sos.ca.gov" },
  "Colorado":       { fee: "$50",  time: "Same day",     filingUrl: "https://www.sos.state.co.us/biz" },
  "Connecticut":    { fee: "$120", time: "3–5 days",     filingUrl: "https://www.concord-sots.ct.gov" },
  "Delaware":       { fee: "$90",  time: "1–3 days",     filingUrl: "https://icis.corp.delaware.gov", notes: "Investor-preferred but has an annual franchise tax. Great for C-Corps, less necessary for most small LLCs." },
  "Florida":        { fee: "$125", time: "Same day",     filingUrl: "https://dos.myflorida.com/sunbiz" },
  "Georgia":        { fee: "$100", time: "7 days",       filingUrl: "https://ecorp.sos.ga.gov" },
  "Hawaii":         { fee: "$50",  time: "3–5 days",     filingUrl: "https://cca.hawaii.gov/breg" },
  "Idaho":          { fee: "$100", time: "Same day",     filingUrl: "https://sosbiz.idaho.gov" },
  "Illinois":       { fee: "$150", time: "10 days",      filingUrl: "https://www.ilsos.gov/departments/business_services" },
  "Indiana":        { fee: "$95",  time: "1 day",        filingUrl: "https://inbiz.in.gov" },
  "Iowa":           { fee: "$50",  time: "5 days",       filingUrl: "https://sos.iowa.gov/business/FormsAndFees.html" },
  "Kansas":         { fee: "$160", time: "3–5 days",     filingUrl: "https://www.kssos.org/business/business.html" },
  "Kentucky":       { fee: "$40",  time: "3–5 days",     filingUrl: "https://sos.ky.gov/bus/business-filings" },
  "Louisiana":      { fee: "$100", time: "Same day",     filingUrl: "https://www.geauxbiz.com" },
  "Maine":          { fee: "$175", time: "1–2 weeks",    filingUrl: "https://www.maine.gov/sos/cec/corp" },
  "Maryland":       { fee: "$100", time: "4–6 weeks",    filingUrl: "https://egov.maryland.gov/businessexpress" },
  "Massachusetts":  { fee: "$500", time: "Same day",     filingUrl: "https://corp.sec.state.ma.us", notes: "One of the highest LLC filing fees in the country at $500." },
  "Michigan":       { fee: "$50",  time: "10 days",      filingUrl: "https://www.michigan.gov/lara" },
  "Minnesota":      { fee: "$155", time: "3–5 days",     filingUrl: "https://mblsportal.sos.state.mn.us" },
  "Mississippi":    { fee: "$50",  time: "1–2 weeks",    filingUrl: "https://www.sos.ms.gov/Business-Services/Pages/default.aspx" },
  "Missouri":       { fee: "$50",  time: "3–5 days",     filingUrl: "https://bsd.sos.mo.gov/" },
  "Montana":        { fee: "$35",  time: "3–5 days",     filingUrl: "https://sosmt.gov/business" },
  "Nebraska":       { fee: "$100", time: "2–3 weeks",    filingUrl: "https://www.sos.ne.gov/business/corp_serv" },
  "Nevada":         { fee: "$425", time: "Same day",     filingUrl: "https://esos.nv.gov", notes: "No state income tax and strong privacy protections, but the initial filing fee is high." },
  "New Hampshire":  { fee: "$100", time: "5 days",       filingUrl: "https://www.sos.nh.gov/corporate-division" },
  "New Jersey":     { fee: "$125", time: "Same day",     filingUrl: "https://www.njportal.com/DOR/BusinessFormation" },
  "New Mexico":     { fee: "$50",  time: "Same day",     filingUrl: "https://www.sos.nm.gov/business-services" },
  "New York":       { fee: "$200", time: "2–3 weeks",    filingUrl: "https://www.dos.ny.gov/corps" },
  "North Carolina": { fee: "$125", time: "Same day",     filingUrl: "https://www.sosnc.gov/divisions/business_registration" },
  "North Dakota":   { fee: "$135", time: "2–5 days",     filingUrl: "https://sos.nd.gov/business/business-services.html" },
  "Ohio":           { fee: "$99",  time: "Same day",     filingUrl: "https://bsportal.ohiosos.gov/" },
  "Oklahoma":       { fee: "$100", time: "3–5 days",     filingUrl: "https://www.sos.ok.gov/business" },
  "Oregon":         { fee: "$100", time: "Same day",     filingUrl: "https://sos.oregon.gov/business" },
  "Pennsylvania":   { fee: "$125", time: "1–2 weeks",    filingUrl: "https://www.corporations.pa.gov" },
  "Rhode Island":   { fee: "$150", time: "Same day",     filingUrl: "https://www.sos.ri.gov/divisions/Business-Portal" },
  "South Carolina": { fee: "$110", time: "Same day",     filingUrl: "https://businessfilings.sc.gov" },
  "South Dakota":   { fee: "$150", time: "Same day",     filingUrl: "https://sdsos.gov/business-services" },
  "Tennessee":      { fee: "$300", time: "3–5 days",     filingUrl: "https://sos.tn.gov/business" },
  "Texas":          { fee: "$300", time: "Same day",     filingUrl: "https://www.sos.state.tx.us/corp/index.shtml" },
  "Utah":           { fee: "$54",  time: "Same day",     filingUrl: "https://secure.utah.gov/bes" },
  "Vermont":        { fee: "$125", time: "3–5 days",     filingUrl: "https://bizfilings.vermont.gov" },
  "Virginia":       { fee: "$100", time: "Same day",     filingUrl: "https://cis.scc.virginia.gov" },
  "Washington":     { fee: "$200", time: "2–3 days",     filingUrl: "https://www.sos.wa.gov/corporations-charities" },
  "West Virginia":  { fee: "$100", time: "Same day",     filingUrl: "https://apps.wv.gov/SOS/BusinessEntitySearch" },
  "Wisconsin":      { fee: "$130", time: "Same day",     filingUrl: "https://www.wdfi.org/corporations" },
  "Wyoming":        { fee: "$100", time: "Same day",     filingUrl: "https://wyobiz.wyo.gov", notes: "No state income tax and strong asset protection laws — popular for holding companies." },
};

export const FOCUS_STATES = ["Florida", "California", "New York", "Texas"] as const;
export type FocusState = (typeof FOCUS_STATES)[number];
