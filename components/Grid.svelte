<script>
    // @ts-ignore
    import Grid from 'svelte-grid/src/index.svelte'

    export let options = {
        items: [],
        cols: 5,
        gap: 10,
        rowHeight: 100,
        breakpoints: [[800, 3], [530, 1]],
        dragDebounceMs: 350,
        useTransform: false,
        fillEmpty: true,
    }

    export let borderRadius = '10px'
    export let boxShadow = '0 2px 8px 3px rgba(69, 91, 99, 0.1)'
    export let test = false
    export let style = {
        default: {
            position: 'relative',
            width: '100%',
        },
        gridContent: {
            width: '100%',
            height: '100%',
            color: 'black',
            display: 'block',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 'large',
        },
        gridComponent: {
            position: 'absolute',
            backgroundColor: '#ffffff',
            zIndex: '2',
            height: '100%',
            overflow: 'hidden',
            boxShadow,
            borderRadius,
        },
    }
    export let theme = {
        default: {},
        gridContent: {},
        gridComponent: {},
    }

    import { makeCSS } from 'svelte-css-in-js'
    const css = makeCSS({ style, theme })
</script>

<svelte:head>
    <style>
        .svlt-grid-resizer {
            z-index: 2;
        }
    </style>
</svelte:head>
<div class={css.default}>
    <Grid {...options} on:resize on:mount on:adjust let:item>
        <div class="{css.gridContent} {css.gridComponent}">
            {#if test}
                <div class="testPlate">
                    <p>W: {item.w} H: {item.h} X: {item.x} Y: {item.y}</p>
                </div>
            {:else if item && item.component}
                <svelte:component this={item.component} />
            {/if}
        </div>
    </Grid>
</div>

<style>
    .testPlate {
        text-align: center;
        width: 100%;
        height: 100%;
    }
    .testPlate > p {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
