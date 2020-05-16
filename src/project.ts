import { currentProject } from "./stores"
import { uuidv4 } from "./util"
import { filterDictionary } from "./filterManager"

export const loadProject = (project: Project) => {
  // @ts-ignore
  currentProject.set(project)
}


export const createExampleProject = () => {
  const project: Project = {
    id: 'example',
    name: "Example projec5t",
    image: 'test_ct.jpg',
    filters: [
    ]
  }

  for (const f of filterDictionary) {
    // const filter: any = Object.create(f)
    // filter.id = uuidv4()
    // filter.enabled = true
    // filter.options = f.defaultOptions
    // project.filters.push(filter)
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