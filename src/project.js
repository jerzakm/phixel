import {
  currentProject
} from "./stores"
import {
  uuidv4
} from "./util"
import {
  shaderDictionary
} from "./webgl/shaderManager"

export const loadProject = (project) => {
  // @ts-ignore
  currentProject.set(project)
}


export const createExampleProject = () => {
  const project = {
    id: 'example',
    name: "Example projec5t",
    image: 'test_ct.jpg',
    filters: []
  }

  for (const f of shaderDictionary) {
    // const filter: any = Object.create(f)
    // filter.id = uuidv4()
    // filter.enabled = true
    // filter.options = f.defaultOptions
    // project.filters.push(filter)
  }

  return project
}