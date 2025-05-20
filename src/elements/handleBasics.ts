export const HANDLER_OFFSETS = [
  {
    type: 'resize',
    name: 'tl',
    x: 0,
    y: 0,
  },
  {
    type: 'resize',
    name: 't',
    x: 0.5,
    y: 0,
  },
  {
    type: 'resize',
    name: 'tr',
    x: 1,
    y: 0,
  },
  {
    type: 'resize',
    name: 'r',
    x: 1,
    y: 0.5,
  },
  {
    type: 'resize',
    name: 'br',
    x: 1,
    y: 1,
  },
  {
    type: 'resize',
    name: 'b',
    x: 0.5,
    y: 1,
  },
  {
    type: 'resize',
    name: 'bl',
    x: 0,
    y: 1,
  },
  {
    type: 'resize',
    name: 'l',
    x: 0,
    y: 0.5,
  },
  // left-center
] as const
export const HANDLER_OFFSETS = [
  {
    type: 'rotate',
    name: 'rotate-tl',
    x: 0,
    y: 0,
    offsetX: -5,
    offsetY: -5,
  },
  {
    type: 'rotate',
    name: 'rotate-tr',
    x: 1,
    y: 0,
    offsetX: 5,
    offsetY: -5,
  },
  {
    type: 'rotate',
    name: 'rotate-br',
    x: 1,
    y: 1,
    offsetX: 5,
    offsetY: 5,
  },
  {
    type: 'rotate',
    name: 'rotate-bl',
    x: 0,
    y: 1,
    offsetX: -5,
    offsetY: 5,
  },
  // left-center
] as const

