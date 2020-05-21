import {
  currentProject
} from './stores'
import {
  uuidv4
} from '../util'

let project

currentProject.subscribe((p) => {
  project = p
})

export const updateFilterProperty = (filterId, property, value) => {
  console.log('updating')
  const filterIndex = project.filters.findIndex(filter => {
    return filter.id == filterId;
  });
  const filter = project.filters[filterIndex]
  project.filters[filterIndex][`${property}`] = value
  currentProject.set(project)
}

export const addNewFilter = ({
  filterRef,
  defaultOptions
}) => {
  const newFilter = {
    id: uuidv4(),
    filterRef: filterRef,
    options: Object.create(defaultOptions),
    enabled: true
  }
  project.filters.push(newFilter)
  currentProject.set(project)
}