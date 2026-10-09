import './ToggleSwitch.css'

interface ToggleSwitchProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleSwitch({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleSwitchProps) {
  const labelId = `${id}-label`
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <div className="toggle">
      <span className="toggle__text">
        <span className="toggle__label" id={labelId}>
          {label}
        </span>
        {description && (
          <span className="toggle__description" id={descriptionId}>
            {description}
          </span>
        )}
      </span>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        className={`toggle__control${checked ? ' toggle__control--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle__thumb" aria-hidden="true" />
      </button>
    </div>
  )
}
