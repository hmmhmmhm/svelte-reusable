<script>
    // @ts-ignore
    import Grid from 'svelte-grid/src/index.svelte'

    export let usePad = true
    export let useBr = true

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

    export let style = {
        default: {
            position: 'relative',
            width: '100%',
            marginTop: '10px',
        },
        gridContent: {
            width: '100%',
            height: '100%',
            color: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 'large',
        },
        gridComponent: {
            position: 'absolute',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            zIndex: '2',
            height: '97%',
            top: '5px',
            boxShadow: '0 2px 8px 3px rgba(69, 91, 99, 0.1)',
            overflow: 'hidden',
        },
        gridComponentPad: {
            position: 'absolute',
            backgroundColor: '#ffffff',
            zIndex: '1',
            height: '100%',
            top: '5px',
            overflow: 'hidden',
        },
        gridComponentBr: {
            position: 'absolute',
            backgroundColor: '#526eb4',
            borderRadius: '23px',
            width: '100%',
            overflow: 'hidden',
        },
        gridComponentInner: {
            position: 'relative',
            width: '90%',
            height: '90%',
        },
    }
    export let theme = {
        default: {},
        gridContent: {},
        gridComponent: {},
        gridComponentPad: {},
        gridComponentBr: {},
        gridComponentInner: {},
    }

    import { makeCSS } from 'svelte-css-in-js'
    const css = makeCSS({ style, theme })
</script>

<div class={css.default}>
    <Grid
        bind:items={options.items}
        {...options}
        on:resize
        on:mount
        on:adjust
        let:item
    >
        <div class="{css.gridContent} {css.gridComponent}">

            <div class={css.gridComponentInner}>
                {#if item && item.component}
                    <svelte:component this={item.component} />
                {/if}
            </div>

            {#if usePad}
                <div
                    class="{css.gridContent}
                    {css.gridComponentPad}"
                    style="background-color: {item.background}; {item.background == '#fff' ? 'top: 5px;' : 'top: 25px;'}"
                />
            {/if}

            {#if useBr}
                <div class="{css.gridContent} {css.gridComponentBr}" />
            {/if}
        </div>
    </Grid>
</div>
