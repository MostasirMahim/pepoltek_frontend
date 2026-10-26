"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RecruiterPod } from "@/types/recruiter.types";
import {
  createRecruiterPodAction,
  updateRecruiterPodAction,
  deleteRecruiterPodAction,
  getRequisitionApplicantsAction,
  updateApplicationStageAction,
  scheduleInterviewAction,
  getClientsAction,
  createClientAction,
  ClientItem,
  RequisitionApplicant,
} from "@/actions/recruiter.actions";
import {
  getPublicBountyTypesAction,
  BountyTypeItem,
} from "@/actions/referral.actions";
import { cleanJobTitle } from "@/lib/title-utils";
import {
  Users,
  Search,
  Eye,
  X,
  CheckCircle,
  Clock,
  ShieldCheck,
  Zap,
  Award,
  ExternalLink,
  DollarSign,
  FileText,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  Kanban,
} from "@/components/ui/Icons";

interface RecruiterPodsViewProps {
  pods: RecruiterPod[];
}

export function RecruiterPodsView({ pods: initialPods }: RecruiterPodsViewProps) {
  const [pods, setPods] = useState<RecruiterPod[]>(initialPods);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Bounty Types Catalog from Backend
  const [bountyTypes, setBountyTypes] = useState<BountyTypeItem[]>([]);

  // Registered Clients Directory (ATS-01)
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);
  const [clientTab, setClientTab] = useState<"list" | "create">("list");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientSectorFilter, setClientSectorFilter] = useState("all");

  // New Client Form Inputs
  const [newClientName, setNewClientName] = useState("");
  const [newClientSector, setNewClientSector] = useState("technology");
  const [newClientWebsite, setNewClientWebsite] = useState("");
  const [newClientChannel, setNewClientChannel] = useState("email");
  const [newClientContactName, setNewClientContactName] = useState("");
  const [newClientContactEmail, setNewClientContactEmail] = useState("");
  const [newClientContactPhone, setNewClientContactPhone] = useState("");
  const [newClientContactRole, setNewClientContactRole] = useState("Hiring Lead");
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [clientActionMessage, setClientActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getPublicBountyTypesAction().then((res) => {
      if (res.success && res.data) {
        setBountyTypes(res.data);
      }
    });

    getClientsAction().then((res) => {
      if (res.success && res.data) {
        setClients(res.data);
      }
    });
  }, []);

  const handleCreateClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    setIsCreatingClient(true);
    setClientActionMessage(null);

    const res = await createClientAction({
      name: newClientName.trim(),
      sector: newClientSector,
      website: newClientWebsite.trim(),
      delivery_channel: newClientChannel,
      primary_contact_name: newClientContactName.trim(),
      primary_contact_email: newClientContactEmail.trim(),
      primary_contact_phone: newClientContactPhone.trim(),
      primary_contact_role: newClientContactRole.trim(),
    });

    setIsCreatingClient(false);
    if (res.success && res.data) {
      const created = res.data;
      setClients((prev) => [created, ...prev]);
      setFormClient(created.name);
      setClientActionMessage({
        type: "success",
        text: `Client ${created.name} registered and selected for requisition.`,
      });
      setNewClientName("");
      setNewClientWebsite("");
      setNewClientContactName("");
      setNewClientContactEmail("");
      setNewClientContactPhone("");
      setTimeout(() => {
        setClientActionMessage(null);
        setClientTab("list");
      }, 1500);
    } else {
      setClientActionMessage({
        type: "error",
        text: res.error || "Failed to create client organization.",
      });
    }
  };

  // Create / Edit Drawer State
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingPod, setEditingPod] = useState<RecruiterPod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields (Single-Role Job Post & One Tier per Requisition)
  const [formTitle, setFormTitle] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formSector, setFormSector] = useState("Technology & SDLC");
  const [formLevel, setFormLevel] = useState("Senior");
  const [formHeadcount, setFormHeadcount] = useState(1);
  const [formSkills, setFormSkills] = useState("React, TypeScript, Python, AWS");
  const [formEngagement, setFormEngagement] = useState("Direct Hire Specialist");
  const [formBudgetMin, setFormBudgetMin] = useState(95);
  const [formBudgetMax, setFormBudgetMax] = useState(135);
  const [formLocation, setFormLocation] = useState("100% Remote (US/EU)");
  const [formVisibility, setFormVisibility] = useState("published_job");
  const [formBountyEnabled, setFormBountyEnabled] = useState(false);
  const [formBountyTypeId, setFormBountyTypeId] = useState("");
  const [formBountyAmount, setFormBountyAmount] = useState(0);
  const [formStatus, setFormStatus] = useState("open");
  const [formDescription, setFormDescription] = useState("");
  const [formResponsibilities, setFormResponsibilities] = useState("");
  const [formRequirements, setFormRequirements] = useState("");
  const [formNiceToHaves, setFormNiceToHaves] = useState("");

  // Applied Candidates Drawer State
  const [selectedPodForApplicants, setSelectedPodForApplicants] = useState<RecruiterPod | null>(null);
  const [applicantsList, setApplicantsList] = useState<RequisitionApplicant[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [candidateStageTab, setCandidateStageTab] = useState<string>("all");

  // Candidate Action Panels inside Drawer
  const [schedulingAppId, setSchedulingAppId] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewType, setInterviewType] = useState("Technical Vetting Panel");
  const [interviewPanel, setInterviewPanel] = useState("Senior Engineering Staff");
  const [interviewLink, setInterviewLink] = useState("https://meet.google.com/ats-sprint-interview");
  const [isScheduling, setIsScheduling] = useState(false);

  const [notingAppId, setNotingAppId] = useState<string | null>(null);
  const [recruiterNoteText, setRecruiterNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const [shortlistedMap, setShortlistedMap] = useState<Record<string, boolean>>({});

  // Toast notification
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4500);
  };

  // Preset Template Helper
  const applyPreset = (presetType: "specialist" | "lead" | "gig" | "bounty") => {
    if (presetType === "specialist") {
      setFormTitle("Senior Core Backend Specialist");
      setFormClient("Enterprise Workspace Partner");
      setFormSector("Technology & SDLC");
      setFormLevel("Senior");
      setFormHeadcount(1);
      setFormSkills("Go, Python, PostgreSQL, Kubernetes");
      setFormEngagement("Direct Hire Specialist");
      setFormBudgetMin(100);
      setFormBudgetMax(140);
      setFormLocation("100% Remote (US/EU)");
      setFormVisibility("published_job");
      setFormBountyEnabled(false);
      setFormBountyTypeId("");
      setFormBountyAmount(0);
      setFormStatus("open");
      setFormDescription("Dedicated backend engineer responsible for high-throughput distributed microservices, database reliability, and 7-day deployment SLA execution.");
      setFormResponsibilities("Architect, develop, and maintain high-throughput backend services and APIs.\nCollaborate in an autonomous sprint cadence with product managers and cross-functional engineers.\nImplement comprehensive automated test suites including unit, integration, and performance benchmarks.\nChampion system resilience, database performance optimization, and zero-downtime CI/CD deployment pipelines.");
      setFormRequirements("5+ years of verified software engineering experience designing and operating production software at scale.\nDeep hands-on proficiency in modern distributed systems, cloud computing, and Go/Python.\nSolid theoretical and practical command of relational database design, indexing, and cache architectures.\nTrack record of writing clean, self-documenting code with proactive security and telemetry instrumentation.");
      setFormNiceToHaves("Experience operating in regulated SOC 2 or HIPAA environments with encrypted data handling.\nFamiliarity with container orchestration (Kubernetes, Docker) and infrastructure-as-code (Terraform).\nActive contributions to open-source software, RFC proposals, or developer communities.");
    } else if (presetType === "lead") {
      setFormTitle("Principal Distributed Systems Architect");
      setFormClient("Apex Cloud Systems");
      setFormSector("Technology & SDLC");
      setFormLevel("Lead/Architect");
      setFormHeadcount(1);
      setFormSkills("Distributed Systems, Rust, Go, AWS, Terraform");
      setFormEngagement("Direct Hire Specialist");
      setFormBudgetMin(130);
      setFormBudgetMax(160);
      setFormLocation("100% Remote (US/EU)");
      setFormVisibility("published_job");
      setFormBountyEnabled(false);
      setFormBountyTypeId("");
      setFormBountyAmount(0);
      setFormStatus("open");
      setFormDescription("Dedicated technical lead architect driving cloud infrastructure modernization, architectural RFC governance, and high-velocity delivery.");
      setFormResponsibilities("Own end-to-end distributed system architecture, scalability RFCs, and fault-tolerant service topologies.\nMentor senior engineering squads across distributed consensus, data synchronization, and event meshes.\nDrive automated chaos testing, latency SLA benchmarks, and security compliance verification.\nServe as primary technical interface between executive leadership and engineering squads.");
      setFormRequirements("8+ years of production experience designing mission-critical distributed architectures.\nMastery of low-latency concurrency models, distributed primitives (Raft/Paxos), and cloud infrastructure.\nDeep expertise in infrastructure-as-code, zero-trust network boundaries, and multi-region failover.\nDemonstrated engineering leadership with successful delivery of enterprise-scale platforms.");
      setFormNiceToHaves("Experience with Kafka, ClickHouse, Apache Flink, or real-time streaming architectures.\nPublished engineering research, RFCs, or technical keynote presentations.\nPrior leadership in SOC 2 Type II or ISO 27001 certification audits.");
    } else if (presetType === "gig") {
      setFormTitle("Next.js & Frontend Architecture Gig");
      setFormClient("Digital Health Labs");
      setFormSector("Technology & SDLC");
      setFormLevel("Senior");
      setFormHeadcount(1);
      setFormSkills("Next.js, React 19, Tailwind CSS, TypeScript");
      setFormEngagement("Contract Sprint");
      setFormBudgetMin(75);
      setFormBudgetMax(110);
      setFormLocation("100% Remote");
      setFormVisibility("published_gig");
      setFormBountyEnabled(false);
      setFormBountyTypeId("");
      setFormBountyAmount(0);
      setFormStatus("open");
      setFormDescription("Short-term project gig focusing on frontend component architecture, responsive design system migration, and Core Web Vitals optimization.");
      setFormResponsibilities("Deliver polished, accessible React 19 and Next.js App Router interfaces matching Figma design systems.\nRefactor legacy state management to modern lightweight patterns with zero layout shift.\nImplement responsive, accessible UI micro-animations and slide-over sheets.\nCoordinate with backend engineering to integrate type-safe API queries and mutations.");
      setFormRequirements("4+ years of production experience with modern TypeScript and React/Next.js frameworks.\nExpertise in Tailwind CSS, responsive mobile-first typography, and modern CSS layout models.\nStrong command of web performance profiling (Core Web Vitals, bundle size reduction).\nPortfolio of production-grade modern web applications demonstrating rich aesthetic polish.");
      setFormNiceToHaves("Experience with Framer Motion or smooth interactive animation libraries.\nKnowledge of WCAG 2.1 AA accessibility guidelines and screen reader testing.\nFamiliarity with Next.js Server Actions and Edge Runtime.");
    } else if (presetType === "bounty") {
      setFormTitle("Healthcare Data Platform Architect");
      setFormClient("Apex Health Systems");
      setFormSector("Healthcare & Clinical");
      setFormLevel("Lead/Architect");
      setFormHeadcount(1);
      setFormSkills("HL7, FHIR, Python, HIPAA, AWS");
      setFormEngagement("Direct Placement");
      setFormBudgetMin(110);
      setFormBudgetMax(155);
      setFormLocation("Hybrid / Remote");
      setFormVisibility("bounty");
      setFormBountyEnabled(true);
      const healthBt = bountyTypes.find((bt) => bt.name.toLowerCase().includes("health")) || bountyTypes[0];
      if (healthBt) {
        setFormBountyTypeId(healthBt.id);
        setFormBountyAmount(healthBt.amount);
      } else {
        setFormBountyAmount(2000);
      }
      setFormStatus("open");
      setFormDescription("High-priority clinical architecture role featuring a referral bounty payout on successful placement. Leads EHR integration and HIPAA data pipelines.");
      setFormResponsibilities("Lead the architectural rollout of FHIR / HL7 clinical data interoperability pipelines.\nEnsure strict HIPAA Title II compliance, audit logging, and encryption across all clinical telemetry.\nCollaborate directly with hospital IT leadership, clinical informatics directors, and security officers.\nBuild resilient data ingestion adapters supporting Epic, Cerner, and specialized EHR vendors.");
      setFormRequirements("6+ years in healthcare technology, clinical informatics, or medical EHR systems.\nDeep technical understanding of HL7 v2/v3, FHIR standard specifications, and SMART-on-FHIR.\nHands-on experience handling Protected Health Information (PHI) under HIPAA / HITECH regulations.\nStrong Python or Go programming skills with cloud data pipeline expertise (AWS HealthLake / S3).");
      setFormNiceToHaves("Direct experience integrating with Epic Community or Cerner Millennium APIs.\nCertifications in healthcare information systems (e.g. CPHIMS or equivalent).\nExperience with DICOM medical imaging or telemetry data streaming.");
    }
  };

  // Quick Status Toggle (Publish / Pause)
  const handleTogglePodStatus = async (pod: RecruiterPod) => {
    if (!pod.rawId) return;
    const isCurrentlyActive = pod.status === "open" || pod.status === "Active Sprint";
    const nextStatus = isCurrentlyActive ? "on_hold" : "open";

    const res = await updateRecruiterPodAction(pod.rawId, { status: nextStatus });
    if (res.success) {
      setPods((prev) =>
        prev.map((p) => (p.rawId === pod.rawId ? { ...p, status: nextStatus } : p))
      );
      showToast(
        nextStatus === "open"
          ? `Requisition "${pod.name}" is now live and published on the job board.`
          : `Requisition "${pod.name}" has been placed on hold.`
      );
    } else {
      showToast(res.error || "Failed to update requisition status.", "error");
    }
  };

  // Open Create Drawer
  const handleOpenCreateDrawer = () => {
    setEditingPod(null);
    setFormTitle("");
    setFormClient("Enterprise Workspace Partner");
    setFormSector("Technology & SDLC");
    setFormLevel("Senior");
    setFormHeadcount(1);
    setFormSkills("React, TypeScript, Go, AWS");
    setFormEngagement("Direct Hire Specialist");
    setFormBudgetMin(95);
    setFormBudgetMax(135);
    setFormLocation("100% Remote (US/EU)");
    setFormVisibility("published_job");
    setFormBountyEnabled(false);
    setFormBountyTypeId("");
    setFormBountyAmount(0);
    setFormStatus("open");
    setFormDescription("Dedicated specialist position deployed under 7-day sprint SLA.");
    setFormResponsibilities(
      "Architect, develop, and maintain high-throughput production services and APIs.\nCollaborate with engineering leads and product stakeholders in rapid 7-day sprint execution cycles.\nImplement comprehensive automated test suites including unit, integration, and performance benchmarks.\nChampion system resilience, database performance optimization, and zero-downtime CI/CD deployment pipelines."
    );
    setFormRequirements(
      "5+ years of verified software engineering experience designing and operating production software at scale.\nDeep hands-on proficiency in modern distributed systems, cloud computing, and core domain tools.\nSolid theoretical and practical command of relational database design, indexing, and cache architectures.\nTrack record of writing clean, self-documenting code with proactive security and telemetry instrumentation."
    );
    setFormNiceToHaves(
      "Experience operating in regulated SOC 2 or HIPAA environments with encrypted data handling.\nFamiliarity with container orchestration (Kubernetes, Docker) and infrastructure-as-code (Terraform).\nActive contributions to open-source software, RFC proposals, or developer communities."
    );
    setIsFormDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEditDrawer = (pod: RecruiterPod) => {
    setEditingPod(pod);
    setFormTitle(pod.name);
    setFormClient(pod.clientName || "Enterprise Workspace Partner");
    setFormSector(pod.sector || (pod.type === "Healthcare" ? "Healthcare & Clinical" : "Technology & SDLC"));
    setFormLevel(pod.level || "Senior");
    setFormHeadcount(1);
    setFormSkills(Array.isArray(pod.members) ? pod.members.join(", ") : "React, TypeScript, Python");
    setFormEngagement(pod.engagement || "Direct Hire Specialist");
    setFormBudgetMin(pod.budgetMin || 95);
    setFormBudgetMax(pod.budgetMax || 135);
    setFormLocation(pod.location || "100% Remote (US/EU)");
    setFormVisibility(pod.visibility || "published_job");
    setFormBountyEnabled(!!pod.bountyEnabled);
    setFormBountyTypeId(pod.bountyTypeId || "");
    setFormBountyAmount(pod.bountyAmount || 0);
    setFormStatus(pod.status === "Active Sprint" ? "open" : pod.status || "open");
    setFormDescription(pod.description || "");
    setFormResponsibilities(
      Array.isArray((pod as any).responsibilities) && (pod as any).responsibilities.length > 0
        ? (pod as any).responsibilities.join("\n")
        : "Architect, develop, and maintain high-throughput production services and APIs.\nCollaborate with engineering leads and product stakeholders in rapid 7-day sprint execution cycles.\nImplement comprehensive automated test suites including unit, integration, and performance benchmarks.\nChampion system resilience, database performance optimization, and zero-downtime CI/CD deployment pipelines."
    );
    setFormRequirements(
      Array.isArray((pod as any).requirements) && (pod as any).requirements.length > 0
        ? (pod as any).requirements.join("\n")
        : "5+ years of verified software engineering experience designing and operating production software at scale.\nDeep hands-on proficiency in modern distributed systems, cloud computing, and core domain tools.\nSolid theoretical and practical command of relational database design, indexing, and cache architectures.\nTrack record of writing clean, self-documenting code with proactive security and telemetry instrumentation."
    );
    setFormNiceToHaves(
      Array.isArray((pod as any).nice_to_haves) && (pod as any).nice_to_haves.length > 0
        ? (pod as any).nice_to_haves.join("\n")
        : "Experience operating in regulated SOC 2 or HIPAA environments with encrypted data handling.\nFamiliarity with container orchestration (Kubernetes, Docker) and infrastructure-as-code (Terraform).\nActive contributions to open-source software, RFC proposals, or developer communities."
    );
    setIsFormDrawerOpen(true);
  };

  // Save / Update Handler
  const handleSavePodForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast("Please enter a descriptive Requisition Title.", "error");
      return;
    }

    setIsSubmitting(true);
    const skillsArray = formSkills.split(",").map((s) => s.trim()).filter(Boolean);
    const responsibilitiesArray = formResponsibilities.split("\n").map((s) => s.trim()).filter(Boolean);
    const requirementsArray = formRequirements.split("\n").map((s) => s.trim()).filter(Boolean);
    const niceToHavesArray = formNiceToHaves.split("\n").map((s) => s.trim()).filter(Boolean);

    if (editingPod && editingPod.rawId) {
      // Update existing pod
      const res = await updateRecruiterPodAction(editingPod.rawId, {
        title: formTitle.trim(),
        client_name: formClient.trim(),
        sector: formSector,
        level: formLevel,
        headcount: Number(formHeadcount),
        skills: skillsArray,
        engagement: formEngagement,
        location: formLocation,
        budget_min: Number(formBudgetMin),
        budget_max: Number(formBudgetMax),
        visibility: formVisibility,
        bounty_enabled: formBountyEnabled,
        bounty_type_id: formBountyEnabled ? formBountyTypeId : null,
        bounty_amount: formBountyEnabled ? Number(formBountyAmount) : 0,
        status: formStatus,
        description: formDescription.trim(),
        responsibilities: responsibilitiesArray,
        requirements: requirementsArray,
        nice_to_haves: niceToHavesArray,
      });

      setIsSubmitting(false);

      if (res.success) {
        setPods((prev) =>
          prev.map((p) => {
            if (p.rawId === editingPod.rawId) {
              return {
                ...p,
                name: formTitle.trim(),
                clientName: formClient.trim(),
                sector: formSector,
                level: formLevel,
                headcount: Number(formHeadcount),
                members: skillsArray,
                budgetMin: Number(formBudgetMin),
                budgetMax: Number(formBudgetMax),
                weeklyBudget: `$${(Number(formBudgetMax) * 40 * Number(formHeadcount)).toLocaleString()}`,
                visibility: formVisibility,
                bountyEnabled: formBountyEnabled,
                bountyTypeId: formBountyEnabled ? formBountyTypeId : undefined,
                bountyTypeName: formBountyEnabled
                  ? bountyTypes.find((bt) => bt.id === formBountyTypeId)?.name || "Referral Bounty"
                  : undefined,
                bountyAmount: formBountyEnabled ? Number(formBountyAmount) : 0,
                status: formStatus,
                description: formDescription.trim(),
                responsibilities: responsibilitiesArray,
                requirements: requirementsArray,
                nice_to_haves: niceToHavesArray,
              } as any;
            }
            return p;
          })
        );
        setIsFormDrawerOpen(false);
        showToast(`Requisition "${formTitle}" updated successfully.`);
      } else {
        showToast(res.error || "Failed to update requisition.", "error");
      }
    } else {
      // Create new pod
      const res = await createRecruiterPodAction({
        title: formTitle.trim(),
        client_name: formClient.trim(),
        sector: formSector,
        level: formLevel,
        headcount: Number(formHeadcount),
        skills: skillsArray,
        engagement: formEngagement,
        location: formLocation,
        budget_min: Number(formBudgetMin),
        budget_max: Number(formBudgetMax),
        visibility: formVisibility,
        bounty_enabled: formBountyEnabled,
        bounty_type_id: formBountyEnabled ? formBountyTypeId : null,
        bounty_amount: formBountyEnabled ? Number(formBountyAmount) : 0,
        status: formStatus,
        description: formDescription.trim(),
        responsibilities: responsibilitiesArray,
        requirements: requirementsArray,
        nice_to_haves: niceToHavesArray,
      });

      setIsSubmitting(false);

      if (res.success && res.data) {
        const isHealth = formSector.toLowerCase().includes("health");
        const rawId = res.data.id;
        const cleanId = rawId ? String(rawId).replace(/-/g, "") : "";
        const shortId = cleanId ? cleanId.slice(-6).toUpperCase() : "NEW";
        const weekly = Number(formBudgetMax) * 40 * Number(formHeadcount);

        const newPod: RecruiterPod = {
          id: `REQ-${shortId}`,
          rawId: rawId,
          name: res.data.title || formTitle,
          type: isHealth ? "Healthcare" : "Software Tech",
          lead: isHealth ? "Dr. Lead Clinician" : "Senior Lead Architect",
          size: `${formHeadcount} Specialist${Number(formHeadcount) > 1 ? "s" : ""}`,
          stage: formStatus === "open" ? "Active Sprint" : "Sprint Assembly",
          velocity: "100% On-Track",
          members: skillsArray.slice(0, 4),
          status: formStatus,
          sprintProgress: "0%",
          deploymentDate: "Just Now",
          weeklyBudget: `$${weekly.toLocaleString()}`,
          burnRate: "Normal",
          clientName: formClient,
          sector: formSector,
          level: formLevel,
          headcount: Number(formHeadcount),
          budgetMin: Number(formBudgetMin),
          budgetMax: Number(formBudgetMax),
          visibility: formVisibility,
          bountyEnabled: formBountyEnabled,
          bountyTypeId: formBountyEnabled ? formBountyTypeId : undefined,
          bountyTypeName: formBountyEnabled
            ? bountyTypes.find((bt) => bt.id === formBountyTypeId)?.name || "Referral Bounty"
            : undefined,
          bountyAmount: formBountyEnabled ? Number(formBountyAmount) : 0,
          description: formDescription,
          candidatesCount: 0,
          location: formLocation,
          engagement: formEngagement,
        };

        setPods([newPod, ...pods]);
        setIsFormDrawerOpen(false);
        showToast(`Requisition "${formTitle}" published successfully to ATS and public Job Board.`);
      } else {
        showToast(res.error || "Failed to publish requisition.", "error");
      }
    }
  };

  // Cancel / Archive Pod
  const handleDeletePod = async (pod: RecruiterPod) => {
    if (!pod.rawId) {
      setPods((prev) => prev.filter((p) => p.id !== pod.id));
      showToast(`Removed requisition ${pod.id} from view.`);
      return;
    }

    if (!confirm(`Are you sure you want to cancel requisition "${pod.name}"?`)) {
      return;
    }

    const res = await deleteRecruiterPodAction(pod.rawId);
    if (res.success) {
      setPods((prev) =>
        prev.map((p) => (p.rawId === pod.rawId ? { ...p, status: "cancelled" } : p))
      );
      showToast(`Requisition "${pod.name}" cancelled.`);
    } else {
      showToast(res.error || "Failed to cancel requisition.", "error");
    }
  };

  // Open Applied Candidates Drawer
  const handleOpenApplicants = async (pod: RecruiterPod) => {
    setSelectedPodForApplicants(pod);
    setIsLoadingApplicants(true);
    setApplicantsList([]);
    setCandidateStageTab("all");
    setSchedulingAppId(null);
    setNotingAppId(null);

    if (pod.rawId) {
      const data = await getRequisitionApplicantsAction(pod.rawId);
      if (data && Array.isArray(data.applicants)) {
        setApplicantsList(data.applicants);
      }
    }
    setIsLoadingApplicants(false);
  };

  // Advance Applicant Stage
  const handleMoveApplicantStage = async (
    applicant: RequisitionApplicant,
    nextStage: string,
    subStageTitle: string
  ) => {
    setUpdatingAppId(applicant.id);
    const res = await updateApplicationStageAction(
      applicant.id,
      nextStage,
      subStageTitle,
      `Recruiter transitioned candidate to ${subStageTitle}`
    );
    setUpdatingAppId(null);

    if (res.success) {
      setApplicantsList((prev) =>
        prev.map((app) =>
          app.id === applicant.id
            ? { ...app, stage: nextStage, sub_stage: subStageTitle }
            : app
        )
      );
      showToast(`Moved ${applicant.full_name} to ${subStageTitle}.`);
    } else {
      showToast(res.error || "Failed to update applicant stage.", "error");
    }
  };

  // Schedule Interview Handler
  const handleScheduleInterviewSubmit = async (app: RequisitionApplicant) => {
    if (!interviewDate) {
      showToast("Please select a date and time for the interview.", "error");
      return;
    }
    setIsScheduling(true);
    const res = await scheduleInterviewAction({
      candidate_name: app.full_name,
      candidate_email: app.email,
      role: selectedPodForApplicants?.name || "Specialist",
      interview_type: interviewType,
      scheduled_time: interviewDate,
      panel: interviewPanel,
      meeting_link: interviewLink,
    });
    setIsScheduling(false);

    if (res.success) {
      // Also advance stage to interview if not already
      handleMoveApplicantStage(app, "interview", "Client Panel Interview Scheduled");
      setSchedulingAppId(null);
      showToast(`Interview scheduled for ${app.full_name} on ${new Date(interviewDate).toLocaleString()}. Calendar invite sent.`);
    } else {
      showToast(res.error || "Failed to schedule interview.", "error");
    }
  };

  // Save Recruiter Evaluation Note Handler
  const handleSaveRecruiterNote = async (app: RequisitionApplicant) => {
    if (!recruiterNoteText.trim()) return;
    setIsSavingNote(true);
    const res = await updateApplicationStageAction(
      app.id,
      app.stage,
      app.sub_stage || "Evaluation Logged",
      recruiterNoteText.trim()
    );
    setIsSavingNote(false);

    if (res.success) {
      setApplicantsList((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, note: recruiterNoteText.trim() } : a))
      );
      setNotingAppId(null);
      setRecruiterNoteText("");
      showToast(`Evaluation note recorded for ${app.full_name}.`);
    } else {
      showToast(res.error || "Failed to save note.", "error");
    }
  };

  // Toggle Shortlist Pitch
  const handleToggleShortlist = (appId: string) => {
    const isNow = !shortlistedMap[appId];
    setShortlistedMap((prev) => ({ ...prev, [appId]: isNow }));
    showToast(isNow ? "Candidate flagged for Client Shortlist submission." : "Candidate removed from Shortlist queue.");
  };

  // Filtered Pods
  const filteredPods = pods.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.clientName && p.clientName.toLowerCase().includes(q)) ||
      (p.members && p.members.some((m) => m.toLowerCase().includes(q)));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && (p.status === "open" || p.status === "Active Sprint")) ||
      (statusFilter === "on_hold" && p.status === "on_hold") ||
      (statusFilter === "filled" && p.status === "filled") ||
      (statusFilter === "cancelled" && p.status === "cancelled");

    const matchesSector =
      sectorFilter === "all" ||
      (sectorFilter === "tech" && p.type.toLowerCase().includes("tech")) ||
      (sectorFilter === "health" && p.type.toLowerCase().includes("health"));

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "specialist" && p.visibility !== "published_gig" && p.visibility !== "bounty") ||
      (typeFilter === "gig" && p.visibility === "published_gig") ||
      (typeFilter === "bounty" && (p.visibility === "bounty" || Number(p.bountyAmount) > 0));

    return matchesSearch && matchesStatus && matchesSector && matchesType;
  });

  const totalApplicantsCount = pods.reduce((acc, p) => acc + (p.candidatesCount || 0), 0);
  const activeBountiesCount = pods.filter((p) => p.bountyEnabled || Number(p.bountyAmount) > 0).length;
  const totalBountyValue = pods.reduce((acc, p) => acc + (Number(p.bountyAmount) || 0), 0);

  // Filtered applicants inside Drawer
  const filteredApplicants = applicantsList.filter((app) => {
    if (candidateStageTab === "all") return true;
    if (candidateStageTab === "discovery") return app.stage === "discovery";
    if (candidateStageTab === "market_mapping") return app.stage === "market_mapping";
    if (candidateStageTab === "technical_vetting") return app.stage === "technical_vetting";
    if (candidateStageTab === "interview") return app.stage === "interview";
    if (candidateStageTab === "closed") return app.stage === "closed";
    if (candidateStageTab === "rejected") return app.stage === "rejected";
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <Zap size={12} />
            <span>REQUISITION &amp; PIPELINE MANAGEMENT</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">
            Enterprise Requisitions &amp; Candidate Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Publish, configure, and manage job and gig requisitions with live applicant tracking and 5-stage ATS pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/jobs"
            target="_blank"
            className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <span>Public Job Board</span>
            <ExternalLink size={12} />
          </Link>

          <Link
            href="/recruiter/applications"
            className="rounded-xl border border-blue-500/30 bg-blue-50/80 px-3.5 py-2 font-display text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <Kanban size={13} />
            <span>Pipeline Kanban</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCreateDrawer}
            className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Create Requisition</span>
          </button>
        </div>
      </div>

      {/* Enterprise KPI Metric Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">Active Requisitions</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="font-display text-2xl font-bold text-ink">
              {pods.filter((p) => p.status === "open" || p.status === "Active Sprint").length}
            </div>
            <span className="text-[11px] font-mono text-ink-soft">
              {pods.length} Total Postings
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">Talent Pipeline</span>
            <Users size={14} className="text-electric" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="font-display text-2xl font-bold text-electric">
              {totalApplicantsCount}
            </div>
            <span className="text-[11px] font-mono text-ink-soft">
              Applied Specialists
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">Bounty Incentives</span>
            <DollarSign size={14} className="text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="font-display text-2xl font-bold text-amber-700">
              ${totalBountyValue.toLocaleString()}
            </div>
            <span className="text-[11px] font-mono text-ink-soft">
              {activeBountiesCount} Roles Live
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">Deployment SLA</span>
            <ShieldCheck size={14} className="text-signal" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="font-display text-2xl font-bold text-signal">
              7-Day Sprint
            </div>
            <span className="text-[11px] font-mono text-signal font-semibold">
              99.8% On-Track
            </span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border px-4 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0 duration-200 ${
            notification.type === "success"
              ? "border-signal/30 bg-signal/10 text-signal"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <CheckCircle size={16} />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Enterprise Unified Toolbar (Search, Filter, Count) */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-3.5 shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, client organization, skill, or ID..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 pl-9 pr-8 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mist hover:text-ink cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Requisition Status"
            className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open (Active)</option>
            <option value="on_hold">On Hold (Paused)</option>
            <option value="filled">Filled (Completed)</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Model / Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by Engagement Model"
            className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Models</option>
            <option value="specialist">Specialist Hire</option>
            <option value="gig">Contract Gig</option>
            <option value="bounty">Bounty Incentive</option>
          </select>

          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            aria-label="Filter by Sector Track"
            className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Sectors</option>
            <option value="tech">Software Tech</option>
            <option value="health">Healthcare</option>
          </select>

          {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || sectorFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
                setSectorFilter("all");
              }}
              className="rounded-xl border border-[#bcd6fa] px-2.5 py-2 text-xs font-mono text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
              title="Reset all filters"
            >
              Reset
            </button>
          )}

          <div className="font-mono text-[11px] text-mist px-2">
            Showing <strong className="text-ink">{filteredPods.length}</strong> of {pods.length}
          </div>
        </div>
      </div>

      {/* Enterprise Data Table View */}
      {filteredPods.length === 0 ? (
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric">
            <Users size={24} />
          </div>
          <h3 className="font-display text-base font-bold text-ink">No Requisitions Match Criteria</h3>
          <p className="mt-1 text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
            There are currently no active job or gig requisitions matching your filter query. Click &ldquo;+ Create Requisition&rdquo; to launch a new opening.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-mono text-[10px] text-slate-500 uppercase tracking-wider select-none">
                  <th className="py-2 px-3 font-semibold">ID</th>
                  <th className="py-2 px-3 font-semibold">Requisition &amp; Client</th>
                  <th className="py-2 px-3 font-semibold">Budget</th>
                  <th className="py-2 px-3 font-semibold">Model</th>
                  <th className="py-2 px-3 font-semibold">Status</th>
                  <th className="py-2 px-3 font-semibold">Pipeline</th>
                  <th className="py-2 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPods.map((pod) => {
                  const isOpen = pod.status === "open" || pod.status === "Active Sprint";
                  const isGig = pod.visibility === "published_gig";
                  const isBounty = pod.visibility === "bounty" || Number(pod.bountyAmount) > 0;
                  const appCount = pod.candidatesCount || 0;

                  return (
                    <tr
                      key={pod.rawId || pod.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Monospace Requisition ID */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-medium text-slate-500 select-all">
                          {pod.id}
                        </span>
                      </td>

                      {/* Requisition Title & Client */}
                      <td className="py-2 px-3">
                        <div className="min-w-[200px] max-w-[340px]">
                          <button
                            type="button"
                            onClick={() => handleOpenApplicants(pod)}
                            className="font-medium text-[12px] text-slate-900 hover:text-electric transition-colors cursor-pointer text-left truncate block max-w-full leading-tight"
                          >
                            {cleanJobTitle(pod.name)}
                          </button>
                          <div className="text-[10.5px] text-slate-400 font-normal truncate mt-0.5 leading-tight">
                            {pod.clientName || "Enterprise Partner"} · {pod.location || "100% Remote"}
                          </div>
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] text-slate-700">
                          ${pod.budgetMin || 95} - ${pod.budgetMax || 135}/hr
                        </span>
                      </td>

                      {/* Model */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {isBounty ? (
                            `$${Number(pod.bountyAmount || 1500).toLocaleString()} Bounty`
                          ) : isGig ? (
                            "Contract Gig"
                          ) : (
                            "Direct Hire"
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isOpen ? "bg-emerald-500" : pod.status === "filled" ? "bg-blue-500" : "bg-slate-300"
                            }`}
                          />
                          <span>
                            {isOpen ? "Active" : pod.status === "filled" ? "Filled" : "Paused"}
                          </span>
                        </div>
                      </td>

                      {/* Candidate Pipeline Link */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenApplicants(pod)}
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 hover:text-electric transition-colors cursor-pointer"
                          title="Open Candidate Dossier"
                        >
                          <Users size={12} className="text-slate-400" />
                          <span className="font-semibold text-slate-800">{appCount}</span>
                          <span className="text-[10px] text-slate-400 font-normal">applied</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditDrawer(pod)}
                            className="rounded p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Requisition Post"
                          >
                            <Edit size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTogglePodStatus(pod)}
                            className={`rounded p-1 transition-colors cursor-pointer ${
                              isOpen
                                ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={isOpen ? "Pause live posting (on hold)" : "Publish live"}
                          >
                            {isOpen ? (
                              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                              </svg>
                            ) : (
                              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Right-Side Sheet Drawer: Candidate List & Recruiter Actions (Slide-over drawer) */}
      {selectedPodForApplicants && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setSelectedPodForApplicants(null)}
        >
          <div
            className="w-full md:w-[620px] lg:w-[680px] bg-white h-full shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-y-auto thin-scrollbar animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">
                      {selectedPodForApplicants.id}
                    </span>
                    <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                      {selectedPodForApplicants.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink">
                    {cleanJobTitle(selectedPodForApplicants.name)}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Client: <strong className="text-ink">{selectedPodForApplicants.clientName}</strong> • {selectedPodForApplicants.type} • Budget: ${selectedPodForApplicants.budgetMin || 95} - ${selectedPodForApplicants.budgetMax || 135}/hr
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPodForApplicants(null)}
                  className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                  title="Close Candidate Sheet"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Candidate Pipeline Stage Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-[#bcd6fa]/30 pb-3">
                {[
                  { id: "all", label: `All (${applicantsList.length})` },
                  { id: "discovery", label: `Discovery (${applicantsList.filter((a) => a.stage === "discovery").length})` },
                  { id: "market_mapping", label: `Screening (${applicantsList.filter((a) => a.stage === "market_mapping").length})` },
                  { id: "technical_vetting", label: `Tech Vetted (${applicantsList.filter((a) => a.stage === "technical_vetting").length})` },
                  { id: "interview", label: `Interview (${applicantsList.filter((a) => a.stage === "interview").length})` },
                  { id: "closed", label: `Placed (${applicantsList.filter((a) => a.stage === "closed").length})` },
                  { id: "rejected", label: `Archived (${applicantsList.filter((a) => a.stage === "rejected").length})` },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCandidateStageTab(st.id)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                      candidateStageTab === st.id
                        ? "bg-ink text-white shadow-xs"
                        : "bg-canvas/50 text-ink-soft hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Applicants Content */}
              {isLoadingApplicants ? (
                <div className="py-16 text-center space-y-2">
                  <div className="mx-auto h-8 w-8 rounded-full border-2 border-electric border-t-transparent animate-spin" />
                  <p className="font-mono text-xs text-mist">
                    Querying ATS candidate pipeline for {selectedPodForApplicants.id}...
                  </p>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-8 text-center space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric">
                    <Users size={20} />
                  </div>
                  <h4 className="font-display text-sm font-bold text-ink">
                    {applicantsList.length === 0 ? "No Online Applications Yet" : "No Candidates in this Stage"}
                  </h4>
                  <p className="text-xs text-ink-soft max-w-sm mx-auto leading-relaxed">
                    {applicantsList.length === 0
                      ? "This requisition is active on the public job board. When candidates apply online, their dossiers will appear here with instant screening actions."
                      : "No specialists currently meet the selected stage filter tab."}
                  </p>
                  {applicantsList.length === 0 && (
                    <div className="pt-2">
                      <Link
                        href="/jobs"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-electric hover:underline"
                      >
                        <span>Check Live Job Board Post</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplicants.map((app) => {
                    const isShortlisted = !!shortlistedMap[app.id];
                    const isSchedulingThis = schedulingAppId === app.id;
                    const isNotingThis = notingAppId === app.id;

                    return (
                      <div
                        key={app.id}
                        className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs space-y-3.5 transition-all"
                      >
                        {/* Candidate Summary Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-ink text-base">
                                {app.full_name}
                              </h4>
                              <span className="rounded-md bg-signal/15 text-signal border border-signal/30 px-2 py-0.5 font-mono text-[10px] font-bold">
                                {app.match_score} Match
                              </span>
                              <span className="rounded-md bg-canvas border border-[#bcd6fa]/50 px-2 py-0.5 font-mono text-[10px] text-ink-soft">
                                {app.level}
                              </span>
                            </div>

                            {/* Contact Details */}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft font-mono mt-1">
                              {app.email && (
                                <a
                                  href={`mailto:${app.email}`}
                                  className="inline-flex items-center gap-1 text-electric hover:underline"
                                >
                                  <Mail size={12} />
                                  <span>{app.email}</span>
                                </a>
                              )}
                              {app.phone && (
                                <a
                                  href={`tel:${app.phone}`}
                                  className="inline-flex items-center gap-1 text-ink-soft hover:text-ink"
                                >
                                  <Phone size={12} />
                                  <span>{app.phone}</span>
                                </a>
                              )}
                              <span className="text-mist">Rate: <strong className="text-ink">{app.rate}</strong></span>
                              <span className="text-mist">Applied: {app.applied_at || "Recent"}</span>
                            </div>
                          </div>

                          {/* Stage Pill */}
                          <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal capitalize shrink-0">
                            {app.sub_stage || app.stage}
                          </span>
                        </div>

                        {/* Skills Chips */}
                        {app.skills && app.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {app.skills.map((s, sIdx) => (
                              <span
                                key={`${s}-${sIdx}`}
                                className="rounded-md bg-canvas px-2 py-0.5 font-mono text-[10px] font-medium text-ink border border-[#bcd6fa]/40"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Candidate Note / Pitch */}
                        {app.note && (
                          <div className="rounded-xl bg-canvas/60 p-2.5 text-xs text-ink-soft border border-[#bcd6fa]/40 space-y-0.5">
                            <span className="font-mono text-[10px] uppercase text-mist font-semibold">Latest ATS Event Note:</span>
                            <p className="font-medium text-ink leading-relaxed">{app.note}</p>
                          </div>
                        )}

                        {/* Recruiter Actions Bar: Schedule Interview, Add Note, Pitch Shortlist */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#bcd6fa]/20">
                          <button
                            type="button"
                            onClick={() => {
                              setSchedulingAppId(isSchedulingThis ? null : app.id);
                              setNotingAppId(null);
                            }}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
                              isSchedulingThis
                                ? "bg-electric text-white border-electric"
                                : "bg-white text-electric border-electric/40 hover:bg-electric/5"
                            }`}
                          >
                            <Calendar size={13} />
                            <span>Schedule Interview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNotingAppId(isNotingThis ? null : app.id);
                              setRecruiterNoteText(app.note || "");
                              setSchedulingAppId(null);
                            }}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
                              isNotingThis
                                ? "bg-ink text-white border-ink"
                                : "bg-white text-ink-soft border-[#bcd6fa] hover:bg-canvas hover:text-ink"
                            }`}
                          >
                            <Edit size={13} />
                            <span>Evaluation Note</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleShortlist(app.id)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
                              isShortlisted
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : "bg-white text-amber-800 border-amber-200 hover:bg-amber-50"
                            }`}
                          >
                            <Sparkles size={13} />
                            <span>{isShortlisted ? "Shortlisted for Pitch" : "Pitch to Client"}</span>
                          </button>
                        </div>

                        {/* Schedule Interview Sub-Panel */}
                        {isSchedulingThis && (
                          <div className="rounded-xl border border-electric/40 bg-electric/5 p-3.5 space-y-3 animate-in fade-in-0 duration-150">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-electric uppercase tracking-wider">
                                Schedule Sprint Interview: {app.full_name}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSchedulingAppId(null)}
                                className="text-mist hover:text-ink cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                              <div>
                                <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                                  Interview Date &amp; Time
                                </label>
                                <input
                                  type="datetime-local"
                                  value={interviewDate}
                                  onChange={(e) => setInterviewDate(e.target.value)}
                                  className="w-full rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-hidden"
                                />
                              </div>

                              <div>
                                <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                                  Interview Format
                                </label>
                                <select
                                  value={interviewType}
                                  onChange={(e) => setInterviewType(e.target.value)}
                                  className="w-full rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-hidden"
                                >
                                  <option value="Technical Vetting Panel">Technical Vetting Panel</option>
                                  <option value="Client System Design Panel">Client System Design Panel</option>
                                  <option value="Clinical Competency Board">Clinical Competency Board</option>
                                  <option value="Executive Culture Fit">Executive Culture Fit</option>
                                </select>
                              </div>

                              <div>
                                <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                                  Panel Evaluator
                                </label>
                                <input
                                  type="text"
                                  value={interviewPanel}
                                  onChange={(e) => setInterviewPanel(e.target.value)}
                                  placeholder="e.g. Lead Architect"
                                  className="w-full rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-hidden"
                                />
                              </div>

                              <div>
                                <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                                  Meeting Link (Google Meet / Zoom)
                                </label>
                                <input
                                  type="url"
                                  value={interviewLink}
                                  onChange={(e) => setInterviewLink(e.target.value)}
                                  placeholder="https://meet.google.com/..."
                                  className="w-full rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-hidden"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setSchedulingAppId(null)}
                                className="rounded-lg border border-[#bcd6fa] px-3 py-1 text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isScheduling}
                                onClick={() => handleScheduleInterviewSubmit(app)}
                                className="rounded-lg bg-electric px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-electric-bright disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                              >
                                {isScheduling ? "Dispatching..." : "Confirm & Send Calendar Invite"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Evaluation Note Sub-Panel */}
                        {isNotingThis && (
                          <div className="rounded-xl border border-[#bcd6fa] bg-canvas/40 p-3.5 space-y-2.5 animate-in fade-in-0 duration-150">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-ink uppercase tracking-wider">
                                Log Recruiter Evaluation: {app.full_name}
                              </span>
                              <button
                                type="button"
                                onClick={() => setNotingAppId(null)}
                                className="text-mist hover:text-ink cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            <textarea
                              rows={2}
                              value={recruiterNoteText}
                              onChange={(e) => setRecruiterNoteText(e.target.value)}
                              placeholder="Record technical feedback, assessment results, or salary negotiation details..."
                              className="w-full rounded-lg border border-[#bcd6fa] bg-white p-2.5 text-xs text-ink focus:border-electric focus:outline-hidden"
                            />

                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setNotingAppId(null)}
                                className="rounded-lg border border-[#bcd6fa] px-3 py-1 text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isSavingNote}
                                onClick={() => handleSaveRecruiterNote(app)}
                                className="rounded-lg bg-ink px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-electric disabled:opacity-50 cursor-pointer"
                              >
                                {isSavingNote ? "Saving..." : "Save Evaluation"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 5-Stage Progression Workflow */}
                        <div className="border-t border-[#bcd6fa]/30 pt-3 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-mist uppercase tracking-wider">5-Stage ATS Pipeline Progression:</span>
                            <span className="text-ink font-semibold">
                              Current: {app.stage.toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                            {/* 1 - Discovery */}
                            <button
                              type="button"
                              disabled={updatingAppId === app.id}
                              onClick={() => handleMoveApplicantStage(app, "discovery", "Discovery & Online Intake")}
                              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer border ${
                                app.stage === "discovery"
                                  ? "bg-slate-800 text-white border-slate-900 shadow-xs"
                                  : "bg-white text-ink-soft border-[#bcd6fa]/60 hover:bg-canvas hover:text-ink"
                              }`}
                            >
                              1. Discovery
                            </button>

                            {/* 2 - Market Mapping */}
                            <button
                              type="button"
                              disabled={updatingAppId === app.id}
                              onClick={() => handleMoveApplicantStage(app, "market_mapping", "Market Mapping & Screening")}
                              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer border ${
                                app.stage === "market_mapping"
                                  ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                                  : "bg-white text-ink-soft border-[#bcd6fa]/60 hover:bg-canvas hover:text-ink"
                              }`}
                            >
                              2. Screening
                            </button>

                            {/* 3 - Technical Vetting */}
                            <button
                              type="button"
                              disabled={updatingAppId === app.id}
                              onClick={() => handleMoveApplicantStage(app, "technical_vetting", "Technical Vetting Cleared")}
                              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer border ${
                                app.stage === "technical_vetting"
                                  ? "bg-signal text-white border-signal shadow-xs"
                                  : "bg-white text-signal border-signal/40 hover:bg-signal/10"
                              }`}
                            >
                              3. Tech Vetting
                            </button>

                            {/* 4 - Client Interview */}
                            <button
                              type="button"
                              disabled={updatingAppId === app.id}
                              onClick={() => handleMoveApplicantStage(app, "interview", "Client Panel Interview")}
                              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer border ${
                                app.stage === "interview"
                                  ? "bg-electric text-white border-electric shadow-xs"
                                  : "bg-white text-electric border-electric/40 hover:bg-electric/10"
                              }`}
                            >
                              4. Client Interview
                            </button>

                            {/* 5 - Closed / Placed */}
                            <button
                              type="button"
                              disabled={updatingAppId === app.id}
                              onClick={() => handleMoveApplicantStage(app, "closed", "Placed & Integrated")}
                              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer border ${
                                app.stage === "closed"
                                  ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                                  : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                              }`}
                            >
                              5. Placed
                            </button>

                            {/* Reject / Archive */}
                            <button
                              type="button"
                              disabled={updatingAppId === app.id}
                              onClick={() => handleMoveApplicantStage(app, "rejected", "Application Archived")}
                              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer border ${
                                app.stage === "rejected"
                                  ? "bg-red-600 text-white border-red-700 shadow-xs"
                                  : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                              }`}
                            >
                              Reject / Archive
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-[#bcd6fa]/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPodForApplicants(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Close Drawer
                </button>

                {selectedPodForApplicants.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("Are you sure you want to cancel and remove this requisition?")) {
                        await handleDeletePod(selectedPodForApplicants);
                        setSelectedPodForApplicants(null);
                      }
                    }}
                    className="rounded-xl border border-rose-200 px-3.5 py-2 font-display text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    <span>Cancel Requisition</span>
                  </button>
                )}
              </div>

              <Link
                href="/jobs"
                target="_blank"
                className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-electric hover:underline"
              >
                <span>Live Requisition on Board</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Right-Side Sheet Drawer: Create & Edit Pod / Job Post (Dashboard UX Invariant) */}
      {isFormDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsFormDrawerOpen(false)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSavePodForm} className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric uppercase tracking-wider">
                      {editingPod ? editingPod.id : "NEW REQUISITION"}
                    </span>
                    <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                      {editingPod ? "EDIT MODE" : "CREATION WIZARD"}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-ink">
                    {editingPod ? `Edit Requisition: ${cleanJobTitle(editingPod.name)}` : "Create Enterprise Requisition"}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Configure requisition role, seniority tier, client demand, and public sync.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Presets (Only on Create) */}
              {!editingPod && (
                <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/40 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-mist">
                    <span className="font-bold uppercase tracking-wider">Quick Requisition Presets:</span>
                    <span>Click to prefill</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset("specialist")}
                      className="rounded-xl border border-electric/40 bg-white px-2.5 py-1 text-xs font-semibold text-electric hover:bg-electric hover:text-white transition-all cursor-pointer"
                    >
                      + Senior Specialist (1 Hire)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("lead")}
                      className="rounded-xl border border-blue-300 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                    >
                      + Lead Architect (1 Hire)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("gig")}
                      className="rounded-xl border border-purple-300 bg-white px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                    >
                      + Contract Gig (1 Hire)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("bounty")}
                      className="rounded-xl border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
                    >
                      + Bounty Role ($1,500)
                    </button>
                  </div>
                </div>
              )}

              {/* Form Input Fields */}
              <div className="space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                    Requisition Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Distributed Core Systems Specialist"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
                  />
                </div>

                {/* Client & Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-mono text-[10px] text-mist uppercase font-semibold block">
                        Client Organization *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsClientDrawerOpen(true);
                          setClientTab("create");
                        }}
                        className="font-mono text-[9.5px] font-bold text-electric hover:underline cursor-pointer"
                      >
                        + New Client
                      </button>
                    </div>
                    <select
                      required
                      value={formClient}
                      onChange={(e) => setFormClient(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:outline-hidden"
                    >
                      <option value="">Select registered client organization...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.sector || "general"} · {c.delivery_channel.toUpperCase()})
                        </option>
                      ))}
                      {formClient && !clients.some((c) => c.name === formClient) && (
                        <option value={formClient}>{formClient}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                      Sector Track
                    </label>
                    <select
                      value={formSector}
                      onChange={(e) => setFormSector(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                    >
                      <option value="Technology & SDLC">Technology &amp; SDLC</option>
                      <option value="Healthcare & Clinical">Healthcare &amp; Clinical</option>
                    </select>
                  </div>
                </div>

                {/* Seniority Tier & Placement */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                      Role Seniority Tier *
                    </label>
                    <select
                      value={formLevel}
                      onChange={(e) => setFormLevel(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                    >
                      <option value="Junior">Junior Tier</option>
                      <option value="Mid">Mid Tier</option>
                      <option value="Senior">Senior Tier</option>
                      <option value="Lead/Architect">Lead/Architect Tier</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                      Target Placement
                    </label>
                    <div className="w-full rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 px-3.5 py-2.5 text-xs text-ink font-medium flex items-center justify-between">
                      <span>Single Hire (1 Position)</span>
                      <span className="font-mono text-[10px] font-bold text-electric bg-electric/10 px-1.5 py-0.5 rounded">
                        1 TIER
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                    >
                      <option value="open">Open (Active)</option>
                      <option value="on_hold">On Hold</option>
                      <option value="filled">Filled</option>
                    </select>
                  </div>
                </div>

                {/* Visibility */}
                <div>
                  <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                    Visibility (Public Sync)
                  </label>
                  <select
                    value={formVisibility}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormVisibility(v);
                      if (v === "bounty") {
                        setFormBountyEnabled(true);
                      }
                    }}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                  >
                    <option value="published_job">Published Job (Public /jobs)</option>
                    <option value="published_gig">Published Gig (Public /jobs gig filter)</option>
                    <option value="bounty">Referral Bounty Role (Public /careers/jobs badge)</option>
                    <option value="private">Private (Confidential Requisition)</option>
                  </select>
                </div>

                {/* Referral Bounty Selector */}
                <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-sm font-bold text-ink">
                        Referral Bounty Incentive
                      </h4>
                      <p className="text-[11px] text-ink-soft">
                        Opt this job post into the Refer and Earn network.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formBountyEnabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormBountyEnabled(checked);
                          if (checked && !formBountyTypeId && bountyTypes.length > 0) {
                            setFormBountyTypeId(bountyTypes[0].id);
                            setFormBountyAmount(bountyTypes[0].amount);
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric" />
                    </label>
                  </div>

                  {formBountyEnabled ? (
                    <div className="space-y-3 pt-2 border-t border-[#bcd6fa]/40 animate-in fade-in-0 duration-150">
                      <div>
                        <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                          Select Bounty Tier
                        </label>
                        <select
                          value={formBountyTypeId}
                          onChange={(e) => {
                            const btId = e.target.value;
                            setFormBountyTypeId(btId);
                            const matched = bountyTypes.find((bt) => bt.id === btId);
                            if (matched) {
                              setFormBountyAmount(matched.amount);
                            }
                          }}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                        >
                          <option value="">Choose standard catalog tier</option>
                          {bountyTypes.map((bt) => (
                            <option key={bt.id} value={bt.id}>
                              {bt.name} - ${bt.amount.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5">
                        <span className="font-mono text-amber-900 font-medium">Bounty Payout Amount:</span>
                        <span className="font-display font-bold text-amber-900 text-sm">
                          ${Number(formBountyAmount).toLocaleString()} USD
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-mist italic">
                      Standard direct placement (no referral bounty will be minted).
                    </p>
                  )}
                </div>

                {/* Budget & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                      Hourly Rate Range ($/hr)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formBudgetMin}
                        onChange={(e) => setFormBudgetMin(Number(e.target.value))}
                        className="w-1/2 rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                      <span className="text-mist text-xs">to</span>
                      <input
                        type="number"
                        value={formBudgetMax}
                        onChange={(e) => setFormBudgetMax(Number(e.target.value))}
                        className="w-1/2 rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                      Location &amp; Overlap
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="100% Remote (US/EU)"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                    Technical Stack / Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formSkills}
                    onChange={(e) => setFormSkills(e.target.value)}
                    placeholder="React, TypeScript, Go, PostgreSQL"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-mono text-[10px] text-mist uppercase font-semibold block mb-1">
                    Job Context &amp; Role Summary
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detail key objectives, squad context, and sprint SLA..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs text-ink focus:border-electric focus:outline-hidden leading-relaxed"
                  />
                </div>

                {/* Structured Responsibilities */}
                <div className="rounded-2xl border border-[#bcd6fa]/80 bg-canvas/20 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] text-electric uppercase font-bold tracking-wider">
                      Key Responsibilities &amp; Deliverables
                    </label>
                    <span className="font-mono text-[10px] text-mist">One bullet per line</span>
                  </div>
                  <textarea
                    rows={4}
                    value={formResponsibilities}
                    onChange={(e) => setFormResponsibilities(e.target.value)}
                    placeholder="Architect high-throughput services&#10;Drive sprint execution with cross-functional team&#10;Implement comprehensive automated test suites"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs text-ink focus:border-electric focus:outline-hidden leading-relaxed font-sans"
                  />
                </div>

                {/* Structured Requirements */}
                <div className="rounded-2xl border border-[#bcd6fa]/80 bg-canvas/20 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] text-electric uppercase font-bold tracking-wider">
                      Core Qualifications &amp; Minimum Requirements
                    </label>
                    <span className="font-mono text-[10px] text-mist">One bullet per line</span>
                  </div>
                  <textarea
                    rows={4}
                    value={formRequirements}
                    onChange={(e) => setFormRequirements(e.target.value)}
                    placeholder="5+ years software engineering experience&#10;Proficiency in distributed systems and cloud primitives&#10;Solid grasp of relational database performance"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs text-ink focus:border-electric focus:outline-hidden leading-relaxed font-sans"
                  />
                </div>

                {/* Structured Nice to Haves */}
                <div className="rounded-2xl border border-[#bcd6fa]/80 bg-canvas/20 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] text-ink uppercase font-bold tracking-wider">
                      Nice-to-Have / Preferred Experience
                    </label>
                    <span className="font-mono text-[10px] text-mist">One bullet per line</span>
                  </div>
                  <textarea
                    rows={3}
                    value={formNiceToHaves}
                    onChange={(e) => setFormNiceToHaves(e.target.value)}
                    placeholder="Experience in regulated SOC 2 or HIPAA environments&#10;Kubernetes and Terraform infrastructure knowledge&#10;Contributions to open-source software"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs text-ink focus:border-electric focus:outline-hidden leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-[#bcd6fa]/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsFormDrawerOpen(false)}
                  className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isSubmitting
                    ? "Publishing..."
                    : editingPod
                    ? "Update Requisition"
                    : "Publish Requisition Live"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right-Side Sheet Drawer: Client Records Management (ATS-01) */}
      {isClientDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-ink/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#bcd6fa]/40 bg-canvas/30 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-electric uppercase tracking-wider">
                    CLIENT MANAGEMENT
                  </span>
                  <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                    ENTERPRISE PARTNER
                  </span>
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">
                  Client Organizations &amp; Delivery Terms
                </h3>
                <p className="text-xs text-ink-soft">
                  Staff-managed client directory with preferred delivery channels and primary hiring contacts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsClientDrawerOpen(false)}
                className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="px-6 pt-4 border-b border-[#bcd6fa]/30 flex items-center gap-2 bg-canvas/10">
              <button
                type="button"
                onClick={() => setClientTab("list")}
                className={`pb-2.5 text-xs font-display font-semibold transition-colors border-b-2 cursor-pointer ${
                  clientTab === "list"
                    ? "border-electric text-electric"
                    : "border-transparent text-mist hover:text-ink"
                }`}
              >
                Registered Directory ({clients.length})
              </button>
              <button
                type="button"
                onClick={() => setClientTab("create")}
                className={`pb-2.5 text-xs font-display font-semibold transition-colors border-b-2 cursor-pointer ${
                  clientTab === "create"
                    ? "border-electric text-electric"
                    : "border-transparent text-mist hover:text-ink"
                }`}
              >
                + Register New Client
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {clientActionMessage && (
                <div
                  className={`rounded-2xl p-4 border ${
                    clientActionMessage.type === "success"
                      ? "border-signal/30 bg-signal/10 text-signal"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <p className="font-display font-bold text-xs">{clientActionMessage.text}</p>
                </div>
              )}

              {clientTab === "list" ? (
                <div className="space-y-3">
                  {/* Search and Filters */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search size={13} className="absolute left-3 top-2.5 text-mist" />
                      <input
                        type="text"
                        value={clientSearchTerm}
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        placeholder="Search clients by name, website, contacts..."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white pl-8 pr-3 py-2 text-xs text-ink focus:border-electric focus:outline-none"
                      />
                    </div>
                    <select
                      value={clientSectorFilter}
                      onChange={(e) => setClientSectorFilter(e.target.value)}
                      className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-none"
                    >
                      <option value="all">All Sectors</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                    </select>
                  </div>

                  {/* Client Cards List */}
                  {clients.length === 0 ? (
                    <div className="rounded-2xl border border-[#bcd6fa] bg-white p-8 text-center text-ink-soft">
                      No client records found. Click "+ Register New Client" to add your first client.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clients
                        .filter((c) => {
                          const q = clientSearchTerm.trim().toLowerCase();
                          const matchesQ =
                            !q ||
                            c.name.toLowerCase().includes(q) ||
                            (c.website && c.website.toLowerCase().includes(q)) ||
                            c.contacts.some((ct) => ct.full_name.toLowerCase().includes(q) || ct.email.toLowerCase().includes(q));
                          const matchesS =
                            clientSectorFilter === "all" ||
                            (c.sector && c.sector.toLowerCase().includes(clientSectorFilter));
                          return matchesQ && matchesS;
                        })
                        .map((c) => (
                          <div
                            key={c.id}
                            className="rounded-2xl border border-[#bcd6fa]/70 bg-white p-4 shadow-2xs hover:border-electric transition-colors space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display font-bold text-ink text-sm">{c.name}</h4>
                                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[9.5px] font-bold text-slate-700 uppercase">
                                    {c.sector || "Tech"}
                                  </span>
                                  <span className="rounded-full bg-electric/10 text-electric border border-electric/20 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase">
                                    {c.delivery_channel}
                                  </span>
                                </div>
                                {c.website && (
                                  <a
                                    href={c.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-mono text-[11px] text-mist hover:text-electric inline-flex items-center gap-1 mt-0.5"
                                  >
                                    <span>{c.website}</span>
                                    <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setFormClient(c.name);
                                  setIsClientDrawerOpen(false);
                                  showToast(`Client ${c.name} selected for requisition.`);
                                }}
                                className="rounded-lg bg-electric/10 hover:bg-electric hover:text-white text-electric px-2.5 py-1 text-xs font-semibold font-display transition-colors cursor-pointer"
                              >
                                Select for Job
                              </button>
                            </div>

                            {/* Contacts & Requisitions Summary */}
                            <div className="grid grid-cols-2 gap-2 rounded-xl bg-canvas/40 p-2.5 font-mono text-[11px]">
                              <div>
                                <span className="text-mist block text-[9.5px] uppercase">Primary Contact:</span>
                                {c.contacts.length > 0 ? (
                                  <span className="text-ink font-semibold">
                                    {c.contacts[0].full_name} ({c.contacts[0].role_title || "Lead"})
                                  </span>
                                ) : (
                                  <span className="text-mist">No contacts recorded</span>
                                )}
                              </div>
                              <div>
                                <span className="text-mist block text-[9.5px] uppercase">Active Requisitions:</span>
                                <span className="text-electric font-bold">
                                  {c.active_requisitions_count || 0} Open Positions
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Create Client Record Form */
                <form id="create-client-form" onSubmit={handleCreateClientSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10.5px] font-bold text-ink block">
                      Company / Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="e.g. Apex Financial Cloud Systems"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-bold text-ink block">
                        Industry Sector Track
                      </label>
                      <select
                        value={newClientSector}
                        onChange={(e) => setNewClientSector(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                      >
                        <option value="technology">Technology &amp; Software SDLC</option>
                        <option value="healthcare">Healthcare &amp; Clinical Systems</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-bold text-ink block">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={newClientWebsite}
                        onChange={(e) => setNewClientWebsite(e.target.value)}
                        placeholder="https://apexsystems.io"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10.5px] font-bold text-ink block">
                      Preferred Shortlist Delivery Channel
                    </label>
                    <select
                      value={newClientChannel}
                      onChange={(e) => setNewClientChannel(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                    >
                      <option value="email">Email Submission Package (PDF &amp; Markdown)</option>
                      <option value="im">Instant Messaging / Slack Connect</option>
                      <option value="client_ats">Client ATS CSV Upload (Workday/Greenhouse)</option>
                      <option value="portal">Client Portal (Post-GTM Dedicated Tenant)</option>
                    </select>
                  </div>

                  {/* Primary Contact Details */}
                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-3">
                    <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-electric block">
                      Primary Hiring Contact (Optional)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[10px] text-mist block mb-1">Contact Name</label>
                        <input
                          type="text"
                          value={newClientContactName}
                          onChange={(e) => setNewClientContactName(e.target.value)}
                          placeholder="e.g. Jordan Lee"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[10px] text-mist block mb-1">Contact Email</label>
                        <input
                          type="email"
                          value={newClientContactEmail}
                          onChange={(e) => setNewClientContactEmail(e.target.value)}
                          placeholder="jordan@apexsystems.io"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[10px] text-mist block mb-1">Phone / WhatsApp</label>
                        <input
                          type="tel"
                          value={newClientContactPhone}
                          onChange={(e) => setNewClientContactPhone(e.target.value)}
                          placeholder="+1 (555) 019-2831"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[10px] text-mist block mb-1">Role Title</label>
                        <input
                          type="text"
                          value={newClientContactRole}
                          onChange={(e) => setNewClientContactRole(e.target.value)}
                          placeholder="VP of Engineering"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-[#bcd6fa]/40 bg-canvas/30 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsClientDrawerOpen(false)}
                className="rounded-xl border border-[#bcd6fa] px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Close
              </button>

              {clientTab === "create" && (
                <button
                  type="submit"
                  form="create-client-form"
                  disabled={isCreatingClient || !newClientName.trim()}
                  className="rounded-xl bg-ink px-5 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isCreatingClient ? "Registering Client..." : "Create Client Record"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
