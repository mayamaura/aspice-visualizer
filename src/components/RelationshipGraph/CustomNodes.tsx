import { Handle, Position } from 'reactflow'

interface GroupNodeData {
  label: string
  name: string
  color: string
  borderColor: string
}

export function GroupNode({ data }: { data: GroupNodeData }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `${data.color}1a`,
        border: `1.5px solid ${data.borderColor}`,
        borderRadius: 8,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '3px 8px', lineHeight: 1.3 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: data.borderColor }}>
          {data.label}
        </span>
        <span style={{ fontSize: 10, color: data.borderColor, opacity: 0.7, marginLeft: 5 }}>
          {data.name}
        </span>
      </div>
    </div>
  )
}

export interface ProcessNodeData {
  label: string
  name: string
  group: string
  bg: string
  border: string
  isRoot?: boolean
  showHandles?: boolean
  purpose?: string
  outcomeCount?: number
  bpCount?: number
}

export function ProcessNode({ data }: { data: ProcessNodeData }) {
  const showHandles = data.showHandles !== false
  return (
    <div
      className="rounded-lg px-3 py-2 min-w-[140px] cursor-pointer transition-all"
      style={{
        background: data.bg,
        border: `2px solid ${data.border}`,
        boxShadow: data.isRoot ? `0 0 12px ${data.border}66` : undefined,
      }}
    >
      {showHandles && <Handle type="target" position={Position.Left} style={{ background: data.border }} />}
      <div className="font-mono text-xs font-bold mb-0.5" style={{ color: data.border }}>
        {data.label}
      </div>
      <div className="text-xs text-gray-200 leading-tight">{data.name}</div>
      {showHandles && <Handle type="source" position={Position.Right} style={{ background: data.border }} />}
    </div>
  )
}

interface OutcomeNodeData {
  label: string
  description: string
}

export function OutcomeNode({ data }: { data: OutcomeNodeData }) {
  return (
    <div className="rounded-lg px-3 py-2 min-w-[200px] max-w-[280px] bg-indigo-950 border-2 border-indigo-600">
      <Handle type="target" position={Position.Left} style={{ background: '#6366f1' }} />
      <div className="font-mono text-xs font-bold text-indigo-400 mb-0.5">{data.label}</div>
      <div className="text-xs text-indigo-200 leading-tight">{data.description}</div>
      <Handle type="source" position={Position.Right} style={{ background: '#6366f1' }} />
    </div>
  )
}

interface BPNodeData {
  label: string
  name: string
  bg: string
  border: string
}

export function BPNode({ data }: { data: BPNodeData }) {
  return (
    <div
      className="rounded-lg px-3 py-2 min-w-[160px] max-w-[240px]"
      style={{ background: data.bg, border: `1.5px solid ${data.border}` }}
    >
      <Handle type="target" position={Position.Left} style={{ background: data.border }} />
      <div className="font-mono text-xs font-bold mb-0.5" style={{ color: data.border }}>
        {data.label}
      </div>
      <div className="text-xs text-gray-200 leading-tight">{data.name}</div>
      <Handle type="source" position={Position.Right} style={{ background: data.border }} />
    </div>
  )
}

interface ItemNodeData {
  label: string
  name: string
  isOutput: boolean
}

export function ItemNode({ data }: { data: ItemNodeData }) {
  const color = data.isOutput ? '#22c55e' : '#3b82f6'
  const bg = data.isOutput ? '#052e16' : '#1e3a5f'
  return (
    <div
      className="rounded-md px-3 py-2 min-w-[120px] max-w-[200px]"
      style={{ background: bg, border: `1.5px solid ${color}` }}
    >
      <Handle type="target" position={Position.Left} style={{ background: color }} />
      <div className="font-mono text-xs font-bold mb-0.5" style={{ color }}>
        {data.label}
      </div>
      <div className="text-xs text-gray-300 leading-tight">{data.name}</div>
      <Handle type="source" position={Position.Right} style={{ background: color }} />
    </div>
  )
}
