import { currentProject } from "./stores"

export const loadProject = (project: Project) => {
  // @ts-ignore
  currentProject.set(project)
}


export const createExampleProject = () => {
  const project: Project = {
    id: 'example',
    name: "Example project",
    image: 'test_waves.jpg',
    filters: []
  }
  return project
}


export interface Project {
  id: string
  name: string
  image?: string
  filters: Filter[]
}

export interface Filter {
  filterRef: string
  options: any
}