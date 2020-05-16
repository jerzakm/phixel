<script lang="typescript">
  // @ts-ignore
  import Topbar from "./components/Topbar.svelte";
  // @ts-ignore
  import Editor from "./components/editor/Editor.svelte";
  // @ts-ignore
  import { currentProject } from "./stores";

  import { createExampleProject, loadProject } from "./project";

  // import Toolbar from "./components/Toolbar.svelte";
  const example = createExampleProject();
  loadProject(example);
</script>

<Topbar />
<Toolbar />
<Editor />
