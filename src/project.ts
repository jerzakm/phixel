export interface Project {
  name: string
  layers: Layer[]
}

export interface Layer {
  filters: Filter[]
  opacity: number
  transform: { x: number, y: number }
}

export interface Filter {
  filterRef: string
  filter: any
  options: any
}