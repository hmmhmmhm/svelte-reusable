<script>
    // @ts-ignore
    import Grid from 'svelte-grid/src/index.svelte'

    export let items = []
    export let cols = 5
    export let gap = 10
    export let rowHeight = 100
    export let breakpoints = [
        [800, 3],
        [530, 1],
    ]

    export let dragDebounceMs = 350
    export let useTransform = false
    export let fillEmpty = true
    export let etc = {}
</script>

<Grid
    bind:items
    let:item
    {items}
    {cols}
    {gap}
    {rowHeight}
    {breakpoints}
    {dragDebounceMs}
    {useTransform}
    {fillEmpty}
    on:resize
    on:mount
    on:adjust
    {...etc}
>
    <svelte:component this={item.component} />
</Grid>
