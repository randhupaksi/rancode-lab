import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  group?: string
}

interface Props {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onValueChange: (value: string) => void
  className?: string
  triggerClassName?: string
  disabled?: boolean
}

export default function SelectField({ id, label, value, options, onValueChange, className = '', triggerClassName = '', disabled = false }: Props) {
  const groups = [...new Set(options.map(option => option.group ?? ''))]
  return <div className={`select-field ${className}`}>
    <label className="select-field-label" htmlFor={id}>{label}</label>
    <div className="select-control"><Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger id={id} className={`select-trigger ${triggerClassName}`} aria-label={label}>
        <Select.Value />
        <Select.Icon className="select-trigger-icon"><ChevronDown size={15} aria-hidden="true"/></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="select-content" position="popper" sideOffset={5} collisionPadding={10}>
          <Select.Viewport className="select-viewport">
            {groups.map(group => {
              const items = options.filter(option => (option.group ?? '') === group)
              const content = items.map(option => <Select.Item className="select-item" value={option.value} key={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="select-item-indicator"><Check size={14} aria-hidden="true"/></Select.ItemIndicator>
              </Select.Item>)
              return group ? <Select.Group key={group}><Select.Label className="select-group-label">{group}</Select.Label>{content}</Select.Group> : content
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root></div>
  </div>
}
