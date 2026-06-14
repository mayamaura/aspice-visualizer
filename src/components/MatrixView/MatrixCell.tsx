import type { Process, InformationItem } from '../../types/aspice'

interface Props {
  process: Process
  item: InformationItem
  filled: boolean
  onClick: (process: Process, item: InformationItem) => void
}

export function MatrixCell({ process, item, filled, onClick }: Props) {
  if (!filled) {
    return <td className="border border-line-subtle w-6 h-6" />
  }

  return (
    <td
      className="border border-line-subtle w-6 h-6 cursor-pointer"
      title={`${process.id} → ${item.id}`}
      onClick={() => onClick(process, item)}
    >
      <div className="w-full h-full flex items-center justify-center bg-blue-600 hover:bg-blue-400 transition-colors">
        <div className="w-3 h-3 rounded-sm bg-blue-300" />
      </div>
    </td>
  )
}
