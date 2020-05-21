<script>
  import Topbar from "./components/Topbar.svelte";
  import Editor from "./components/editor/Editor.svelte";
  import { currentProject } from "./stores";

  import { createExampleProject, loadProject } from "./project";

  const example = createExampleProject();
  loadProject(example);
</script>

<Topbar />
<Editor />
