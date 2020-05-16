What it is?


```js
function detach(node) {
    node.parentNode.removeChild(node);
}
```

what should be(for my use case)


```js
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
    else {
        console.warn('Error: patch-package: svelte detach failed')
    }
}
```


Why it happens? Something about svelte swapping and destroying elements in a loop
```js
<div class="color-list">
  {#each filter.options[`${option.filterProperty}`] as color, i}
    <ColorPicker {color}/>
  {/each}
</div>
```


npm i patch-package

npx patch-package svelte

Applying patches
Run patch-package without arguments to apply all patches in your project.