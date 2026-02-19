import { SkillKey } from "@/lib/types";

interface IconProps {
  x: number;
  y: number;
  color: string;
  size?: number;
}

// ═══════════════════════════════════════════
// AI CONFIG ICONS
// ═══════════════════════════════════════════

function AgentsIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <rect x={3} y={1} width={12} height={16} rx={1} fill={color} opacity={0.2} />
      <rect x={3} y={1} width={12} height={16} rx={1} stroke={color} strokeWidth={1.5} fill="none" />
      <path d={`M3,3 Q1,3 1,5 L1,7 Q1,5 3,5`} fill={color} opacity={0.4} />
      <line x1={6} y1={5} x2={12} y2={5} stroke={color} strokeWidth={1} opacity={0.6} />
      <line x1={6} y1={8} x2={13} y2={8} stroke={color} strokeWidth={1} opacity={0.6} />
      <line x1={6} y1={11} x2={11} y2={11} stroke={color} strokeWidth={1} opacity={0.6} />
      <circle cx={14} cy={14} r={4} fill={color} />
      <text x={14} y={15.5} textAnchor="middle" fill="#0a0e1a" fontSize="5" fontWeight="bold">A</text>
    </g>
  );
}

function ClaudeMdIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <rect x={2} y={1} width={12} height={16} rx={1} fill={color} opacity={0.2} />
      <rect x={2} y={1} width={12} height={16} rx={1} stroke={color} strokeWidth={1.5} fill="none" />
      <path d={`M9,5 L10,8 L13,9 L10,10 L9,13 L8,10 L5,9 L8,8 Z`} fill={color} />
    </g>
  );
}

function ClaudeDirIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <path d={`M2,5 L2,3 Q2,2 3,2 L7,2 L9,4 L15,4 Q16,4 16,5`} fill={color} opacity={0.3} />
      <rect x={2} y={5} width={14} height={11} rx={1} fill={color} opacity={0.2} />
      <rect x={2} y={5} width={14} height={11} rx={1} stroke={color} strokeWidth={1.5} fill="none" />
      <path d={`M9,8 L9.7,10 L12,10.5 L9.7,11 L9,13 L8.3,11 L6,10.5 L8.3,10 Z`} fill={color} opacity={0.9} />
    </g>
  );
}

function CursorRulesDirIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <path d={`M2,5 L2,3 Q2,2 3,2 L7,2 L9,4 L15,4 Q16,4 16,5`} fill={color} opacity={0.3} />
      <rect x={2} y={5} width={14} height={11} rx={1} fill={color} opacity={0.2} />
      <rect x={2} y={5} width={14} height={11} rx={1} stroke={color} strokeWidth={1.5} fill="none" />
      <path d={`M7,7 L7,13 L9,11.5 L11,14 L12,13 L10,10.5 L12,10.5 Z`} fill={color} opacity={0.8} />
    </g>
  );
}

function CursorignoreIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <path d={`M4,2 L4,11 L6,9 L9,13 L10.5,12 L7.5,8 L10,8 Z`} fill={color} opacity={0.3} stroke={color} strokeWidth={1} strokeLinejoin="round" />
      <circle cx={12} cy={12} r={5} fill="none" stroke={color} strokeWidth={1.5} opacity={0.8} />
      <line x1={8.5} y1={15.5} x2={15.5} y2={8.5} stroke={color} strokeWidth={1.5} opacity={0.8} />
    </g>
  );
}

// ═══════════════════════════════════════════
// BUILD & VERIFY ICONS
// ═══════════════════════════════════════════

function MakefileIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <line x1={5} y1={13} x2={11} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <rect x={9} y={2} width={7} height={5} rx={1} fill={color} opacity={0.3} stroke={color} strokeWidth={1.5} transform="rotate(45, 12, 5)" />
    </g>
  );
}

function CiWorkflowsIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <path d={`M9,3 A6,6 0 1,1 3,9`} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <path d={`M9,15 A6,6 0 1,1 15,9`} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <polygon points="3,6 3,10 6,8" fill={color} opacity={0.8} />
      <polygon points="15,8 15,12 12,10" fill={color} opacity={0.8} />
    </g>
  );
}

// ═══════════════════════════════════════════
// DOCUMENTATION ICONS
// ═══════════════════════════════════════════

function ReadmeIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <path d={`M9,3 L2,3 Q1,3 1,4 L1,15 Q1,16 2,16 L9,16`} fill={color} opacity={0.15} stroke={color} strokeWidth={1.3} />
      <path d={`M9,3 L16,3 Q17,3 17,4 L17,15 Q17,16 16,16 L9,16`} fill={color} opacity={0.15} stroke={color} strokeWidth={1.3} />
      <line x1={9} y1={3} x2={9} y2={16} stroke={color} strokeWidth={1} />
      <line x1={3} y1={7} x2={7} y2={7} stroke={color} strokeWidth={0.8} opacity={0.5} />
      <line x1={3} y1={10} x2={7} y2={10} stroke={color} strokeWidth={0.8} opacity={0.5} />
      <line x1={11} y1={7} x2={15} y2={7} stroke={color} strokeWidth={0.8} opacity={0.5} />
      <line x1={11} y1={10} x2={15} y2={10} stroke={color} strokeWidth={0.8} opacity={0.5} />
    </g>
  );
}

function ContributingIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <circle cx={5} cy={5} r={2.5} fill={color} opacity={0.2} stroke={color} strokeWidth={1.2} />
      <path d={`M1,15 Q1,10 5,10 Q9,10 9,15`} fill={color} opacity={0.15} stroke={color} strokeWidth={1.2} />
      <circle cx={13} cy={5} r={2.5} fill={color} opacity={0.2} stroke={color} strokeWidth={1.2} />
      <path d={`M9,15 Q9,10 13,10 Q17,10 17,15`} fill={color} opacity={0.15} stroke={color} strokeWidth={1.2} />
    </g>
  );
}

// Additional Docs - Stack of documents / library
function AdditionalDocsIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      {/* Stacked documents */}
      <rect x={4} y={5} width={11} height={12} rx={1} fill={color} opacity={0.1} stroke={color} strokeWidth={1} />
      <rect x={3} y={3} width={11} height={12} rx={1} fill={color} opacity={0.15} stroke={color} strokeWidth={1} />
      <rect x={2} y={1} width={11} height={12} rx={1} fill={color} opacity={0.2} stroke={color} strokeWidth={1.3} />
      {/* Text lines on top doc */}
      <line x1={4} y1={4} x2={10} y2={4} stroke={color} strokeWidth={0.8} opacity={0.6} />
      <line x1={4} y1={6.5} x2={11} y2={6.5} stroke={color} strokeWidth={0.8} opacity={0.6} />
      <line x1={4} y1={9} x2={9} y2={9} stroke={color} strokeWidth={0.8} opacity={0.6} />
      {/* Plus badge */}
      <circle cx={14} cy={14} r={3.5} fill={color} opacity={0.9} />
      <line x1={12.5} y1={14} x2={15.5} y2={14} stroke="#0a0e1a" strokeWidth={1.3} strokeLinecap="round" />
      <line x1={14} y1={12.5} x2={14} y2={15.5} stroke="#0a0e1a" strokeWidth={1.3} strokeLinecap="round" />
    </g>
  );
}

// ═══════════════════════════════════════════
// CODE QUALITY ICONS
// ═══════════════════════════════════════════

function TypeCheckingIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <line x1={3} y1={3} x2={13} y2={3} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1={8} y1={3} x2={8} y2={14} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx={14} cy={13} r={4} fill={color} opacity={0.3} stroke={color} strokeWidth={1} />
      <path d={`M12,13 L13.5,14.5 L16,11.5`} stroke={color} strokeWidth={1.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function LinterIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <circle cx={8} cy={8} r={5.5} fill={color} opacity={0.1} stroke={color} strokeWidth={1.5} />
      <line x1={12} y1={12} x2={17} y2={17} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <path d={`M6,6 L4.5,8 L6,10`} stroke={color} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M10,6 L11.5,8 L10,10`} stroke={color} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function FormatterIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <line x1={2} y1={3} x2={16} y2={3} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={4} y1={6.5} x2={14} y2={6.5} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={4} y1={10} x2={12} y2={10} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={2} y1={13.5} x2={16} y2={13.5} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={2} y1={5} x2={2} y2={12} stroke={color} strokeWidth={0.8} opacity={0.3} strokeDasharray="1 1" />
    </g>
  );
}

function PreCommitHooksIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <path d={`M9,1 L9,10 Q9,14 6,14 Q3,14 3,11`} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
      <line x1={1} y1={6} x2={17} y2={6} stroke={color} strokeWidth={1.5} opacity={0.4} />
      <rect x={12} y={3} width={4} height={6} rx={1} fill={color} opacity={0.2} stroke={color} strokeWidth={1} />
      <path d={`M13,5.5 L14,7 L15.5,4.5`} stroke={color} strokeWidth={1} fill="none" strokeLinecap="round" />
    </g>
  );
}

function TestInfraIcon({ x, y, color, size = 18 }: IconProps) {
  const s = size / 18;
  return (
    <g transform={`translate(${x - 9 * s}, ${y - 9 * s}) scale(${s})`}>
      <rect x={7} y={1} width={4} height={5} fill={color} opacity={0.15} stroke={color} strokeWidth={1.2} />
      <path d={`M7,6 L3,14 Q2,16 4,16 L14,16 Q16,16 15,14 L11,6`} fill={color} opacity={0.15} stroke={color} strokeWidth={1.3} strokeLinejoin="round" />
      <path d={`M5,12 L13,12 L15,14 Q16,16 14,16 L4,16 Q2,16 3,14 Z`} fill={color} opacity={0.25} />
      <circle cx={8} cy={13} r={1} fill={color} opacity={0.5} />
      <circle cx={11} cy={11} r={0.7} fill={color} opacity={0.5} />
    </g>
  );
}

// ═══════════════════════════════════════════
// ICON MAP & EXPORT
// ═══════════════════════════════════════════

const SKILL_ICON_MAP: Record<SkillKey, React.FC<IconProps>> = {
  // AI Config
  agentsMd: AgentsIcon,
  claudeMd: ClaudeMdIcon,
  claudeDir: ClaudeDirIcon,
  cursorRulesDir: CursorRulesDirIcon,
  cursorignore: CursorignoreIcon,
  // Build & Verify
  makefile: MakefileIcon,
  ciWorkflows: CiWorkflowsIcon,
  // Documentation
  readme: ReadmeIcon,
  contributing: ContributingIcon,
  additionalDocs: AdditionalDocsIcon,
  // Code Quality
  typeChecking: TypeCheckingIcon,
  linter: LinterIcon,
  formatter: FormatterIcon,
  preCommitHooks: PreCommitHooksIcon,
  testInfra: TestInfraIcon,
};

export function SkillIcon({
  skillKey,
  ...props
}: IconProps & { skillKey: SkillKey }) {
  const IconComponent = SKILL_ICON_MAP[skillKey];
  return <IconComponent {...props} />;
}
