import {
  currentProject,
  selectedFilter
} from "./stores/stores"
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

export const createNewProject = () => {
  return {
    id: uuidv4(),
    name: 'New project',
    image: undefined,
    filters: []
  }
}

export const createExampleProject = () => {
  const project = {
    id: 'example',
    name: "Example projec5t",
    image: 'assets/example_causeway.jpg',
    filters: []
  }

  for (const f of shaderDictionary) {
    if (f.filterRef == 'paletteLimiter' || f.filterRef == 'pixelate') {
      const filter = Object.create(f)
      filter.id = uuidv4()
      filter.enabled = true
      filter.options = f.defaultOptions
      project.filters.push(filter)
    }
  }

  // selectedFilter.set(project.filters[4].id)

  return project
}