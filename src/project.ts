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
    filters: [
      {
        filterRef: 'pixelate',
        enabled: true,
        options: {
          size: 4
        }
      },
      {
        filterRef: 'adjustment',
        enabled: true,
        options: {
          saturation: 2
        }
      },
      {
        filterRef: 'blur',
        enabled: true,
        options: {
          strength: 4
        }
      }
    ]
  }
  return project
}


export interface Project {
  id: string
  name: string
  image?: string
  filters: ProjectFilter[]
}

export interface ProjectFilter {
  filterRef: string
  options: any
  enabled: boolean
  optionsOpen?: boolean
}