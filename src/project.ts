import { currentProject } from "./stores"
import { uuidv4 } from "./util"

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
        id: uuidv4(),
        filterRef: 'pixelate',
        enabled: true,
        options: {
          size: 8
        }
      },
      {
        id: uuidv4(),
        filterRef: 'adjustment',
        enabled: true,
        options: {
          saturation: 2
        }
      },
      {
        id: uuidv4(),
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
  id: string
  filterRef: string
  options: any
  enabled: boolean
  optionsOpen?: boolean
}