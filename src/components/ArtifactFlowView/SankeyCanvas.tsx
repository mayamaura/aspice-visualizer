import { useRef, useEffect, useState, useMemo } from 'react'
import {
  computeSankeyLayout,
  bandPath,
  LEFT_LABEL_MARGIN,
  RIGHT_LABEL_MARGIN,
} from './sankeyLayout'
import type { LayoutNode, LayoutLink } from './sankeyLayout'
import type { SankeyNode, SankeyLink } from './sankeyData'

interface Props {
  nodes: SankeyNode[]
  links: SankeyLink[]
  onNodeClick: (nodeId: string) => void
  onLinkClick: (link: LayoutLink) => void
}

const PADDING_X = 16
const PADDING_Y = 16

export function SankeyCanvas({ nodes, links, onNodeClick, onLinkClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setSize({ width: Math.max(400, r.width), height: Math.max(300, r.height) })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const { layoutNodes, layoutLinks } = useMemo(
    () =>
      computeSankeyLayout(
        nodes,
        links,
        size.width - PADDING_X * 2,
        size.height - PADDING_Y * 2,
      ),
    [nodes, links, size],
  )

  const hoveredNodeIds = useMemo(() => {
    if (!hoveredId) return new Set<string>()
    const related = new Set<string>([hoveredId])
    for (const ll of layoutLinks) {
      if (ll.id === hoveredId || ll.sourceId === hoveredId || ll.targetId === hoveredId) {
        related.add(ll.sourceId)
        related.add(ll.targetId)
      }
    }
    return related
  }, [hoveredId, layoutLinks])

  const svgW = size.width
  const svgH = size.height

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg width={svgW} height={svgH} className="select-none">
        <g transform={`translate(${PADDING_X},${PADDING_Y})`}>
          {/* リンク帯（背面に描画） */}
          {layoutLinks.map((ll) => {
            const srcNode = layoutNodes.find((n) => n.id === ll.sourceId)!
            const tgtNode = layoutNodes.find((n) => n.id === ll.targetId)!
            const isHovered = hoveredId === ll.id
            const isDimmed =
              hoveredId !== null &&
              !isHovered &&
              hoveredId !== ll.sourceId &&
              hoveredId !== ll.targetId

            const x0 = srcNode.x + srcNode.width
            const x1 = tgtNode.x
            const path = bandPath(x0, ll.sy0, ll.sy1, x1, ll.ty0, ll.ty1)

            return (
              <path
                key={ll.id}
                d={path}
                fill={ll.color}
                fillOpacity={isHovered ? 0.7 : isDimmed ? 0.08 : 0.35}
                stroke={isHovered ? '#ffffff' : 'transparent'}
                strokeWidth={isHovered ? 0.5 : 0}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredId(ll.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onLinkClick(ll)}
              />
            )
          })}

          {/* ノード矩形 */}
          {layoutNodes.map((ln) => {
            const isDimmed =
              hoveredId !== null && !hoveredNodeIds.has(ln.id)
            const isHovered = hoveredId === ln.id

            return (
              <g key={ln.id}>
                <rect
                  x={ln.x}
                  y={ln.y}
                  width={ln.width}
                  height={ln.height}
                  fill={ln.color}
                  fillOpacity={isHovered ? 0.9 : isDimmed ? 0.2 : 0.75}
                  rx={3}
                  className={`transition-all duration-150 ${ln.side === 'left' ? 'cursor-pointer' : 'cursor-pointer'}`}
                  onMouseEnter={() => setHoveredId(ln.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onNodeClick(ln.id)}
                />
                {/* ノードラベル */}
                <NodeLabel node={ln} isDimmed={isDimmed} />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

function NodeLabel({ node, isDimmed }: { node: LayoutNode; isDimmed: boolean }) {
  const FONT_SIZE = 11
  const PAD = 6
  const textOpacity = isDimmed ? 0.3 : 1

  // ラベルをノードの外側に配置（左ノード=左側、右ノード=右側）
  if (node.side === 'left') {
    return (
      <text
        x={node.x - PAD}
        y={node.y + node.height / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={FONT_SIZE}
        fill="#d1d5db"
        fillOpacity={textOpacity}
        className="pointer-events-none"
        style={{ fontFamily: 'ui-monospace, monospace' }}
      >
        <TruncatedText text={node.label} maxWidth={LEFT_LABEL_MARGIN - PAD * 2} />
      </text>
    )
  }
  return (
    <text
      x={node.x + node.width + PAD}
      y={node.y + node.height / 2}
      textAnchor="start"
      dominantBaseline="middle"
      fontSize={FONT_SIZE}
      fill="#d1d5db"
      fillOpacity={textOpacity}
      className="pointer-events-none"
      style={{ fontFamily: 'ui-monospace, monospace' }}
    >
      <TruncatedText text={node.label} maxWidth={RIGHT_LABEL_MARGIN - PAD * 2} />
    </text>
  )
}

// SVG テキストを簡易トランケート（文字数制限）
function TruncatedText({ text, maxWidth }: { text: string; maxWidth: number }) {
  // 1文字 ≈ 6.5px で概算トランケート
  const maxChars = Math.floor(maxWidth / 6.5)
  const display = text.length > maxChars ? text.slice(0, maxChars - 1) + '…' : text
  return <>{display}</>
}
