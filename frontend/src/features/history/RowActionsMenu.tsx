import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import './RowActionsMenu.css'

export interface RowAction {
  key: string
  label: string
  onSelect: () => void
  disabled?: boolean
  title?: string
}

interface RowActionsMenuProps {
  label: string
  actions: RowAction[]
}

interface MenuCoords {
  top: number
  left: number
}

export function RowActionsMenu({ label, actions }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<MenuCoords>({ top: 0, left: 0 })
  const [activeIndex, setActiveIndex] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const enabledIndices = useMemo(
    () =>
      actions
        .map((action, index) => (action.disabled ? -1 : index))
        .filter((index) => index !== -1),
    [actions],
  )

  function openMenu() {
    const trigger = triggerRef.current
    if (trigger) {
      const rect = trigger.getBoundingClientRect()
      setCoords({ top: rect.bottom + 6, left: rect.right - 160 })
    }
    setActiveIndex(enabledIndices[0] ?? -1)
    setOpen(true)
  }

  function closeMenu(restoreFocus = false) {
    setOpen(false)
    setActiveIndex(-1)
    if (restoreFocus) {
      triggerRef.current?.focus()
    }
  }

  useLayoutEffect(() => {
    if (!open) {
      return
    }

    const trigger = triggerRef.current
    const menu = menuRef.current
    if (!trigger || !menu) {
      return
    }

    const triggerRect = trigger.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    let top = triggerRect.bottom + 6
    if (top + menuRect.height > window.innerHeight - 8) {
      top = Math.max(8, triggerRect.top - menuRect.height - 6)
    }

    let left = triggerRect.right - menuRect.width
    if (left < 8) {
      left = 8
    }
    if (left + menuRect.width > window.innerWidth - 8) {
      left = window.innerWidth - 8 - menuRect.width
    }

    setCoords({ top, left })
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return
      }
      closeMenu()
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu(true)
      }
    }

    function handleReposition() {
      closeMenu()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open])

  useEffect(() => {
    if (!open || activeIndex < 0) {
      return
    }
    itemRefs.current[activeIndex]?.focus()
  }, [open, activeIndex])

  function handleTriggerKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openMenu()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu()
      setActiveIndex(enabledIndices[enabledIndices.length - 1] ?? -1)
    }
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (enabledIndices.length === 0) {
        return
      }
      const position = enabledIndices.indexOf(activeIndex)
      const step = event.key === 'ArrowDown' ? 1 : -1
      const nextPosition =
        (position + step + enabledIndices.length) % enabledIndices.length
      setActiveIndex(enabledIndices[nextPosition])
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(enabledIndices[0] ?? -1)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(enabledIndices[enabledIndices.length - 1] ?? -1)
    } else if (event.key === 'Tab') {
      closeMenu()
    }
  }

  function handleSelect(action: RowAction) {
    if (action.disabled) {
      return
    }
    closeMenu()
    action.onSelect()
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="row-actions__trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span aria-hidden="true">⋮</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="row-actions__menu"
            role="menu"
            aria-label={label}
            style={{ top: coords.top, left: coords.left }}
            onKeyDown={handleMenuKeyDown}
          >
            {actions.map((action, index) => (
              <button
                key={action.key}
                type="button"
                role="menuitem"
                ref={(element) => {
                  itemRefs.current[index] = element
                }}
                className={`row-actions__item${
                  action.key === 'delete' ? ' row-actions__item--danger' : ''
                }`}
                tabIndex={index === activeIndex ? 0 : -1}
                disabled={action.disabled}
                title={action.title}
                onClick={() => handleSelect(action)}
              >
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
