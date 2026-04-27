// data.jsx — mock data for the Maxer prototype

const MOCK_JOBS = [
  {
    id: 'job-001',
    company: 'Vector Labs',
    role: 'Senior Backend Engineer — Distributed Systems',
    location: 'Berlin, DE',
    distance_km: 42,
    posted: '2h ago',
    salary: '€95–115k',
    stack: ['TypeScript', 'Go', 'PostgreSQL', 'Kubernetes'],
    primary_stack: 'TS',
    score: 94,
    breakdown: { skills: 96, location: 92, salary: 88, culture: 95 },
    resume: 'DE-TS-Resume.pdf',
    resume_alt: 'DE-Backend-Resume.pdf',
    logic: 'Resume A (DE-TS) was selected over Resume B because the listing emphasizes TypeScript ecosystem (Bun, Node) over generic backend. 3 of the 5 must-have skills appear verbatim in Resume A.',
    new: true,
    description: 'We are looking for an experienced backend engineer to architect our event streaming platform. You will work directly with the founding team on a high-throughput pipeline processing 200M events/day. Stack is heavily TypeScript on Bun runtime with select Go services for hot paths.',
    must_have: ['5+ yrs production TS', 'Distributed systems', 'PostgreSQL', 'On-call experience'],
    nice_to_have: ['Bun runtime', 'Kafka / NATS', 'Open source contrib'],
  },
  {
    id: 'job-002',
    company: 'Meridian Health',
    role: 'Staff Software Engineer, Platform',
    location: 'Munich, DE',
    distance_km: 58,
    posted: '5h ago',
    salary: '€110–135k',
    stack: ['.NET', 'C#', 'Azure', 'MSSQL'],
    primary_stack: '.NET',
    score: 91,
    breakdown: { skills: 94, location: 86, salary: 92, culture: 92 },
    resume: 'DE-DotNet-Resume.pdf',
    resume_alt: 'DE-TS-Resume.pdf',
    logic: 'Resume B (DE-DotNet) selected. Job requires deep .NET 8 + Azure expertise — Resume B has 6 years of C# experience, Resume A is TypeScript-heavy.',
    new: true,
    description: 'Healthcare platform team is hiring a Staff Engineer to lead our patient-data services modernization. Migrating legacy .NET Framework to .NET 8 on Azure. Compliance-heavy environment (GDPR, HL7).',
    must_have: ['.NET 8', 'Azure (App Service, Service Bus)', 'Healthcare domain ok', 'Architecture experience'],
    nice_to_have: ['HL7 / FHIR', 'MSSQL tuning', 'German B2'],
  },
  {
    id: 'job-003',
    company: 'Tessera',
    role: 'Full-Stack Engineer (TypeScript)',
    location: 'Remote — DE',
    distance_km: 0,
    posted: '8h ago',
    salary: '€80–95k',
    stack: ['TypeScript', 'React', 'tRPC', 'Postgres'],
    primary_stack: 'TS',
    score: 89,
    breakdown: { skills: 90, location: 100, salary: 78, culture: 88 },
    resume: 'DE-TS-Resume.pdf',
    resume_alt: 'DE-Frontend-Resume.pdf',
    logic: 'Full-remote — distance score is 100. Resume A (TS) used because the role spans frontend + backend, matching the full-stack TS profile.',
    new: true,
    description: 'Series B startup building procurement tools for the construction industry. Small team (12 eng) shipping fast on a TS monorepo. tRPC + Drizzle.',
    must_have: ['TypeScript fluency', 'React 18+', 'Database modeling', 'Self-directed'],
    nice_to_have: ['tRPC or GraphQL', 'Drizzle / Prisma', 'Solo project history'],
  },
  {
    id: 'job-004',
    company: 'Helix Dynamics',
    role: 'Senior Software Engineer — Robotics',
    location: 'Stuttgart, DE',
    distance_km: 64,
    posted: '11h ago',
    salary: '€100–120k',
    stack: ['C++', 'Python', 'ROS2', 'Linux'],
    primary_stack: 'C++',
    score: 76,
    breakdown: { skills: 71, location: 80, salary: 84, culture: 70 },
    resume: 'DE-Backend-Resume.pdf',
    resume_alt: '—',
    logic: 'Below 90% threshold. Match dragged down by ROS2 / robotics-specific experience gap.',
    new: false,
    description: 'Build the autonomy stack for warehouse robotics. C++ heavy, ROS2, real-time Linux.',
    must_have: ['C++17/20', 'ROS2', 'Real-time Linux', 'Robotics or autonomy bg'],
    nice_to_have: ['SLAM', 'CUDA', 'German fluent'],
  },
  {
    id: 'job-005',
    company: 'Northwind Audio',
    role: 'Backend Engineer (TypeScript)',
    location: 'Hamburg, DE',
    distance_km: 49,
    posted: '14h ago',
    salary: '€85–100k',
    stack: ['TypeScript', 'Node', 'Redis', 'Postgres'],
    primary_stack: 'TS',
    score: 87,
    breakdown: { skills: 89, location: 88, salary: 82, culture: 90 },
    resume: 'DE-TS-Resume.pdf',
    resume_alt: 'DE-Backend-Resume.pdf',
    logic: 'Resume A picked for TypeScript primacy. Salary slightly under expectation drags score.',
    new: false,
    description: 'Music streaming platform, audio processing pipeline. Real-time low-latency Node services.',
    must_have: ['Node.js / TS', 'Redis', 'Audio or media bg helpful'],
    nice_to_have: ['WebRTC', 'FFmpeg', 'Live streaming'],
  },
  {
    id: 'job-006',
    company: 'Quanta Logistics',
    role: 'Senior Platform Engineer',
    location: 'Frankfurt, DE',
    distance_km: 52,
    posted: '19h ago',
    salary: '€105–125k',
    stack: ['.NET', 'Kubernetes', 'Terraform', 'AWS'],
    primary_stack: '.NET',
    score: 83,
    breakdown: { skills: 86, location: 84, salary: 90, culture: 72 },
    resume: 'DE-DotNet-Resume.pdf',
    resume_alt: 'DE-Backend-Resume.pdf',
    logic: 'Resume B for .NET. Culture score lower — large enterprise, traditional process.',
    new: false,
    description: 'Logistics platform, hybrid cloud (AWS + on-prem). .NET microservices on EKS.',
    must_have: ['.NET 6+', 'K8s', 'IaC (Terraform)'],
    nice_to_have: ['AWS certs', 'SAFe / Scrum', 'Logistics domain'],
  },
];

const MOCK_RESUMES = [
  { name: 'DE-TS-Resume.pdf',     size: '142 KB', updated: '3d ago',  uses: 47, kind: 'resume', tag: 'TypeScript / Full-stack' },
  { name: 'DE-DotNet-Resume.pdf', size: '156 KB', updated: '1w ago',  uses: 31, kind: 'resume', tag: '.NET / Backend' },
  { name: 'DE-Backend-Resume.pdf',size: '138 KB', updated: '2w ago',  uses: 18, kind: 'resume', tag: 'Generic Backend' },
  { name: 'DE-Frontend-Resume.pdf',size: '134 KB',updated: '4w ago',  uses: 9,  kind: 'resume', tag: 'React / Frontend' },
  { name: 'AWS-SAA-C03.pdf',      size: '88 KB',  updated: '6mo ago', uses: 22, kind: 'cert',   tag: 'AWS Solutions Architect' },
  { name: 'CKA-Cert.pdf',         size: '76 KB',  updated: '8mo ago', uses: 14, kind: 'cert',   tag: 'CKA — Kubernetes' },
];

const MOCK_DB_LOG = [
  { id: 1284, company: 'Vector Labs',    role: 'Sr Backend Engineer',     resume: 'DE-TS-Resume.pdf',      method: 'SMTP',       at: '2026-04-28 09:42:11', status: 'sent' },
  { id: 1283, company: 'Meridian Health',role: 'Staff Eng, Platform',     resume: 'DE-DotNet-Resume.pdf',  method: 'Playwright', at: '2026-04-28 09:38:02', status: 'sent' },
  { id: 1282, company: 'Tessera',        role: 'Full-Stack Eng',          resume: 'DE-TS-Resume.pdf',      method: 'SMTP',       at: '2026-04-28 09:11:55', status: 'sent' },
  { id: 1281, company: 'Northwind Audio',role: 'Backend Eng',             resume: 'DE-TS-Resume.pdf',      method: 'Playwright', at: '2026-04-27 18:24:30', status: 'sent' },
  { id: 1280, company: 'Quanta Log.',    role: 'Sr Platform Eng',         resume: 'DE-DotNet-Resume.pdf',  method: 'Playwright', at: '2026-04-27 17:02:12', status: 'pending' },
  { id: 1279, company: 'Helix Dynamics', role: 'Sr SW Eng — Robotics',    resume: 'DE-Backend-Resume.pdf', method: 'SMTP',       at: '2026-04-27 14:55:01', status: 'rejected' },
  { id: 1278, company: 'Iconis',         role: 'Backend Eng',             resume: 'DE-TS-Resume.pdf',      method: 'SMTP',       at: '2026-04-27 11:18:44', status: 'sent' },
  { id: 1277, company: 'Brightline',     role: 'Sr Eng',                  resume: 'DE-DotNet-Resume.pdf',  method: 'Playwright', at: '2026-04-27 09:02:09', status: 'sent' },
  { id: 1276, company: 'Otsu',           role: 'Platform Eng',            resume: 'DE-Backend-Resume.pdf', method: 'SMTP',       at: '2026-04-26 21:44:51', status: 'sent' },
];

const MOCK_PROVIDERS = [
  { id: 'or-gemma',  name: 'OpenRouter · gemma-3-12b:free',     family: 'OpenRouter', tier: 'free',  status: 'active',   latency: 412, tokens_in: 184_220, tokens_out: 62_900, cost: 0.00, priority: 1 },
  { id: 'or-llama',  name: 'OpenRouter · llama-3.2-3b:free',     family: 'OpenRouter', tier: 'free',  status: 'standby',  latency: 380, tokens_in: 92_410,  tokens_out: 30_120, cost: 0.00, priority: 2 },
  { id: 'ollama',    name: 'Ollama · llama3.2 (local)',          family: 'Ollama',     tier: 'local', status: 'standby',  latency: 1_250, tokens_in: 12_900, tokens_out: 8_100, cost: 0.00, priority: 3 },
  { id: 'claude',    name: 'Claude · sonnet-4',                  family: 'Anthropic',  tier: 'paid',  status: 'standby',  latency: 720, tokens_in: 41_800,  tokens_out: 19_220, cost: 4.81, priority: 4 },
];

const MOCK_TOOL_TIMELINE = [
  { iter: 1, tool: 'list_directory',  args: '~/projects/maxer',                        danger: 'safe',      result: '14 entries', dur: 12,  status: 'done', approved: 'auto' },
  { iter: 2, tool: 'read_file',       args: 'app/llm/router.py',                       danger: 'safe',      result: '142 lines',  dur: 8,   status: 'done', approved: 'auto' },
  { iter: 3, tool: 'search_in_files', args: 'pattern: "OpenRouterProvider"',           danger: 'safe',      result: '4 matches',  dur: 24,  status: 'done', approved: 'auto' },
  { iter: 4, tool: 'read_file',       args: 'app/llm/openrouter.py',                   danger: 'safe',      result: '88 lines',   dur: 9,   status: 'done', approved: 'auto' },
  { iter: 5, tool: 'write_file',      args: 'app/llm/openrouter.py — patch',           danger: 'moderate',  result: 'awaiting…',  dur: null,status: 'pending', approved: null },
];

const MOCK_DIFF = [
  { kind: 'meta', text: '@@ app/llm/openrouter.py:54-71 @@' },
  { kind: 'ctx', text: '    async def stream(self, messages):' },
  { kind: 'ctx', text: '        headers = {' },
  { kind: 'ctx', text: '            \'Authorization\': f\'Bearer {self.key}\',' },
  { kind: 'del', text: '            \'Content-Type\': \'application/json\',' },
  { kind: 'add', text: '            \'Content-Type\': \'application/json\',' },
  { kind: 'add', text: '            \'HTTP-Referer\': \'https://maxer.local\',' },
  { kind: 'add', text: '            \'X-Title\': \'Maxer Agent\',' },
  { kind: 'ctx', text: '        }' },
  { kind: 'ctx', text: '        payload = {' },
  { kind: 'del', text: '            \'model\': self.model,' },
  { kind: 'add', text: '            \'model\': self.model,' },
  { kind: 'add', text: '            \'usage\': { \'include\': True },' },
  { kind: 'ctx', text: '            \'stream\': True,' },
  { kind: 'ctx', text: '            \'messages\': [m.model_dump() for m in messages],' },
  { kind: 'ctx', text: '        }' },
];

const COVER_LETTER_TEMPLATE = (job) => `Dear ${job.company} hiring team,

I came across your ${job.role} listing this morning and it lines up directly with the work I have been shipping for the past five years — high-throughput ${job.primary_stack === '.NET' ? '.NET services on Azure' : job.primary_stack === 'TS' ? 'TypeScript services on Node and Bun' : 'C++ systems'} backed by Postgres and event streaming.

Two things stood out in the listing:

1. The pipeline scale you describe (the stack hints at significant write volume) is the exact problem space I worked on at my last role, where we cut p99 latency by 38% by moving from a polling model to a queue-driven one.
2. ${job.location.includes('Remote') ? 'Remote-first' : `Your ${job.location} office`} is a fit — I am ${job.location.includes('Remote') ? 'fully set up for remote async work' : `based ~${job.distance_km}km away and open to hybrid`}.

I have attached ${job.resume}, which weights my recent ${job.primary_stack} work. Happy to walk through the relevant projects on a call.

Best,
Daniel Vogt`;

Object.assign(window, {
  MOCK_JOBS, MOCK_RESUMES, MOCK_DB_LOG, MOCK_PROVIDERS,
  MOCK_TOOL_TIMELINE, MOCK_DIFF, COVER_LETTER_TEMPLATE,
});
