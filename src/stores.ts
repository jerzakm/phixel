import { writable } from 'svelte/store';
import { Project } from './project';

const emptyProject: Project = {
  id: '',
  name: 'empty',
  filters: []
}

export const userAuth = writable(undefined);
export const openProject = writable(undefined)
export const currentProject = writable(emptyProject)