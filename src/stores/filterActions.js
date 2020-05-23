import {
  currentProject,
  selectedFilter
} from './stores'
import {
  uuidv4
} from '../util'

let project
let selectedFilterUuid

currentProject.subscribe((p) => {
  project = p
})

selectedFilter.subscribe((id) => {
  selectedFilterUuid = id
})

export const updateFilterProperty = (filterId, property, value) => {
  const filterIndex = project.filters.findIndex(filter => {
    return filter.id == filterId;
  });
  const filter = project.filters[filterIndex]
  project.filters[filterIndex][`${property}`] = value
  currentProject.set(project)
  console.log(value)
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

export const selectFilter = (filterId) => {
  if (filterId == selectedFilterUuid) {
    selectedFilter.set(null)
  } else {
    selectedFilter.set(filterId)
  }
}