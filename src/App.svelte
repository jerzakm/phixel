<script>
  import Topbar from "./components/Topbar.svelte";
  import Editor from "./components/editor/Editor.svelte";
  import { currentProject } from "./stores/stores";

  import {
    createExampleProject,
    createNewProject,
    loadProject
  } from "./project";

  // const project = createExampleProject();
  const project = createNewProject();
  loadProject(project);
</script>

<Topbar />
<Editor />
