import {
  writable
} from 'svelte/store';
import {
  Project
} from '../project';

const emptyProject = {
  id: '',
  name: 'empty',
  filters: []
}

export const userAuth = writable(undefined);
export const openProject = writable(undefined)
export const currentProject = writable(emptyProject)
export const filterUpdate = writable(false)
export const selectedFilter = writable(false)