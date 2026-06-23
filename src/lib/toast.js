const TOAST_LIMIT = 5

let idCounter = 0
let state = []
const listeners = new Set()
const timers = new Map()

function notifyListeners() {
  listeners.forEach(listener => listener(state))
}

function nextId() {
  idCounter += 1
  return `toast-${Date.now()}-${idCounter}`
}

function normalizeToast(input, type = 'default') {
  return {
    id: input.id || nextId(),
    title: input.title || '',
    description: input.description || '',
    duration: input.duration ?? 4200,
    dismissible: input.dismissible !== false,
    action: input.action || null,
    meta: input.meta || null,
    appearance: {
      fontFamily: input.fontFamily || 'Space Grotesk',
      titleSize: input.titleSize || 15,
      descriptionSize: input.descriptionSize || 15,
      actionSize: input.actionSize || 13,
      radius: input.radius || 10,
      paddingX: input.paddingX || 16,
      paddingY: input.paddingY || 8,
      blur: input.blur || 2,
      backgroundOpacity: input.backgroundOpacity || 0.28,
      surfaceFadeDuration: input.surfaceFadeDuration || 0.28,
      textFadeDuration: input.textFadeDuration || 0.22,
    },
    createdAt: Date.now(),
  }
}

function clearToastTimer(id) {
  const timer = timers.get(id)
  if (!timer) return

  window.clearTimeout(timer)
  timers.delete(id)
}

function scheduleToastTimer(toastItem) {
  clearToastTimer(toastItem.id)

  if (typeof window === 'undefined' || !toastItem.duration || toastItem.duration <= 0) return

  const timer = window.setTimeout(() => {
    dismissToast(toastItem.id)
  }, toastItem.duration)

  timers.set(toastItem.id, timer)
}

function setState(updater) {
  state = typeof updater === 'function' ? updater(state) : updater
  notifyListeners()
}

function addToast(input, type) {
  const item = normalizeToast(input, type)

  setState(current => [item, ...current.filter(toastItem => toastItem.id !== item.id)].slice(0, TOAST_LIMIT))
  scheduleToastTimer(item)

  return item.id
}

function updateToast(id, patch) {
  let updated = null

  setState(current =>
    current.map(item => {
      if (item.id !== id) return item
      updated = { ...item, ...patch }
      return updated
    })
  )

  if (updated) {
    scheduleToastTimer(updated)
  }
}

function dismissToast(id) {
  clearToastTimer(id)
  setState(current => current.filter(item => item.id !== id))
}

function clearToasts() {
  timers.forEach(timer => window.clearTimeout(timer))
  timers.clear()
  setState([])
}

export function subscribeToToasts(listener) {
  listeners.add(listener)
  listener(state)

  return () => {
    listeners.delete(listener)
  }
}

export function getToastState() {
  return state
}

export const toast = {
  show(input) {
    return addToast(input, 'default')
  },
  update(id, patch) {
    updateToast(id, patch)
  },
  dismiss(id) {
    dismissToast(id)
  },
  clear() {
    clearToasts()
  },
}

export const notify = toast
