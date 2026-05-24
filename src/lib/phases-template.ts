export const DEFAULT_PHASES = [
  {
    number: 1,
    name: "Contract Signing & Project Handover",
    description: "Your project officially begins. The signed contract triggers a carefully orchestrated handover to our design operations team.",
    steps: [
      { title: "Contract & Proposal Signing", description: "You sign the contract and proposal. An advance payment is processed. This initiates the formal handover to EVA's design operations team." },
      { title: "Handover Package Verification", description: "Our Document Controller verifies the completeness of your handover package: signed contract, scope of work, advance payment receipt, client brief, architectural drawings, and the handover checklist." },
      { title: "Technical Feasibility Review", description: "Our Technical Manager reviews architectural drawings for structural, MEP, and feasibility checks. If drawings are unavailable, a site survey is arranged." },
      { title: "Project Setup in Systems", description: "Your project is created in EVA's systems within 1 business day — all phases, spaces, assigned team members, and financial milestones are logged." },
      { title: "Project Communication Group", description: "A dedicated WhatsApp group is created including the Head of Design, your Relationship Manager, General Manager, CEO, and Customer Experience Executive." },
    ],
  },
  {
    number: 2,
    name: "Project Kick-Off",
    description: "Your dedicated Relationship Manager is assigned, and together you'll define the design vision and establish the project roadmap.",
    steps: [
      { title: "Welcome Package Delivery", description: "You receive a personalized Welcome Package within 2 business days of the Kick-off Meeting, including a CEO video message and your RM's profile with past projects." },
      { title: "Client Kick-Off Meeting", description: "Your RM presents the summarized brief, preferred styles, and priorities. You'll discuss your vision, requirements, budget constraints, and communication preferences." },
      { title: "Client Stakeholder Interview", description: "The RM captures your project overview, scope confirmation, specific requirements, budget and timeline constraints, and acceptance criteria." },
      { title: "Communication Setup", description: "You are informed about stages of work, check-ins, the change request and approval process, and useful contacts from EVA." },
      { title: "Program of Work (POW)", description: "Within 2 business days of the Kick-off, you receive the confirmed Program of Work — the full project schedule with all phases, milestones, and deadlines." },
      { title: "Weekly Progress Updates Begin", description: "From this point forward, you receive a weekly progress update summarizing completed tasks, next steps, pending approvals, and project status." },
    ],
  },
  {
    number: 3,
    name: "Moodboard Development",
    description: "Your design concept takes visual shape. Curated materials, colour palettes, and reference imagery are assembled for your spaces.",
    steps: [
      { title: "First 50% Moodboard Preparation", description: "Your RM prepares the Moodboard Presentation including furniture layouts per space, key FF&E items with finishes, fit-out materials, colour palettes, and reference images." },
      { title: "Internal Quality Review", description: "Every Moodboard passes through EVA's Creative Design Director for compliance with House Style Standards and your brief requirements." },
      { title: "Moodboard Presentation Meeting", description: "Your RM presents the Moodboard, explaining the design intent and thought process for each space. You provide your approval status per space." },
      { title: "Approval Status Assignment", description: "For each space, you assign: Approved, Approved with Comments, or Revise & Resubmit. All decisions are documented in the Minutes of Meeting." },
      { title: "Revision Handling (If Required)", description: "If any space is marked 'Revise & Resubmit,' your RM revises the Moodboard and schedules a follow-up meeting for affected spaces only." },
      { title: "Second 50% Moodboard", description: "The remaining spaces follow the same preparation, review, and presentation process, incorporating feedback from the first batch." },
    ],
  },
  {
    number: 4,
    name: "3D Visualization",
    description: "Your approved Moodboards come to life as photorealistic 3D renders — showing exactly how your spaces will look with real-world lighting, textures, and materials.",
    steps: [
      { title: "3D Modelling & Material Application", description: "A dedicated 3D Visualizer models your spaces based on approved Moodboards, applying materials, fabrics, finishes, accessories, and styling details." },
      { title: "Test Render & Internal Quality Control", description: "Test renders are reviewed against a 3D Quality Control Checklist covering lighting accuracy, texture realism, resolution, and FF&E compliance." },
      { title: "3D Client Presentation (First 50%)", description: "Your RM presents the 3D renders, explaining design intent and alignment with your approved Moodboards. You provide feedback and approval statuses." },
      { title: "3D Approval & Revision", description: "Each space is categorized as Approved, Approved with Comments, or Revise & Resubmit. Revisions are implemented and follow-up meetings scheduled." },
      { title: "Second 50% 3D Development", description: "The remaining 3D visuals are developed, reviewed internally, and presented to you following the same quality-controlled process." },
    ],
  },
  {
    number: 5,
    name: "2D Drawings & List of Finishes",
    description: "Your approved 3D designs are translated into precise technical drawings and comprehensive material specifications ready for construction.",
    steps: [
      { title: "LOF Development Trigger", description: "Upon approval of 3D visuals, the List of Finishes development begins following the CDD's LOF Standard Guidelines." },
      { title: "Payment Verification (Stop-and-Go)", description: "Before 2D development begins, your payment status is verified. A 'GO' status is required to proceed." },
      { title: "2D Drawing Package Production", description: "The 2D drafting team produces detailed technical drawings aligned with approved 3D visuals and MEP coordination standards." },
      { title: "2D & LOF Formal Submission", description: "The final 2D package and LOF are submitted to you via official email and shared in the project WhatsApp group." },
      { title: "Final 2D Review Meeting", description: "A client meeting is scheduled 2 weeks after submission to give you time to review with your contractor or execution team." },
      { title: "2D & LOF Revisions", description: "If revisions are needed, the Technical Manager assesses feasibility, changes are implemented, and a Review Session is scheduled within 2 business days." },
    ],
  },
  {
    number: 6,
    name: "Project Closure & Handover",
    description: "The final milestone — confirmation, feedback, and the official handover of your complete design package.",
    steps: [
      { title: "Final Delivery Confirmation", description: "The Finance Team confirms receipt of the final submission and processes the final milestone payment." },
      { title: "Project Closure Confirmation", description: "An official Project Closure Confirmation Email is issued with a completed and signed Project Closure Checklist." },
      { title: "Handover Package & NPS Survey", description: "The Customer Care Representative contacts you to organize the official handover package delivery and conducts the NPS satisfaction survey." },
    ],
  },
];

export const DEFAULT_APPROVALS = [
  { phase: "Contract", title: "Contract & Proposal Signing", description: "Signed contract and advance payment", priority: "critical" },
  { phase: "Kick-Off", title: "Client Brief & Stakeholder Interview", description: "Requirements, preferences, budget, style preferences", priority: "critical" },
  { phase: "Kick-Off", title: "Vision Alignment Checklist", description: "Signed confirmation of preferences and exclusions", priority: "required" },
  { phase: "Kick-Off", title: "Program of Work Acknowledgment", description: "Confirmation of project schedule", priority: "required" },
  { phase: "Moodboard", title: "Moodboard Approval (First 50%)", description: "Approval status per space", priority: "critical" },
  { phase: "Moodboard", title: "Moodboard Revision Confirmation", description: "Confirmation of visual representation of changes", priority: "required" },
  { phase: "Moodboard", title: "Moodboard Approval (Second 50%)", description: "Approval status per remaining space", priority: "critical" },
  { phase: "3D Design", title: "3D Render Approval (First 50%)", description: "Approval status per space", priority: "critical" },
  { phase: "3D Design", title: "3D Render Approval (Second 50%)", description: "Final approval status for all spaces", priority: "critical" },
  { phase: "2D & LOF", title: "Payment Milestone (Stop-and-Go)", description: "Milestone payment per contract terms", priority: "critical" },
  { phase: "2D & LOF", title: "2D & LOF Review Meeting", description: "Feedback, clarifications, revision requests", priority: "required" },
  { phase: "Closure", title: "Final Payment", description: "Final milestone payment", priority: "critical" },
  { phase: "Closure", title: "NPS Feedback Survey", description: "Satisfaction rating and feedback", priority: "required" },
];

export const DEFAULT_SCHEDULE = [
  { phase: "Phase 01", title: "Handover & Setup", duration: "Max 5 business days", milestones: "Contract signing, Package verification (1 day), Technical review, System setup (1 day)" },
  { phase: "Phase 02", title: "Kick-Off & Planning", duration: "Within 1 week of handover", milestones: "RM assignment, Kick-off Meeting, Client Brief, POW delivery (2 days post-KO)" },
  { phase: "Phase 03", title: "Moodboard Development", duration: "Per POW schedule", milestones: "First 50% preparation, Internal CDD review, Client presentation, Revisions (max 2 days)" },
  { phase: "Phase 04", title: "3D Visualization", duration: "Per POW schedule", milestones: "3D modelling, Internal QC & CDD review, Client presentation, Revisions per contract" },
  { phase: "Phase 05", title: "2D & LOF Documentation", duration: "Per POW schedule", milestones: "LOF development, Payment verification, 2D package production, Review meeting" },
  { phase: "Phase 06", title: "Closure & Handover", duration: "21 days post final delivery", milestones: "Final payment, 21-day finalization window, Closure confirmation, NPS survey" },
];
