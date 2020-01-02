<script>
    import { tns } from 'tiny-slider/src/tiny-slider'
    import { onMount, onDestroy, tick, afterUpdate } from 'svelte'

    export let container = undefined
    export let slider = undefined
    export let navContainer = undefined
    export let options = {
        mouseDrag: true,
        autoWidth: true,
        autoHeight: false,
        mode: 'carousel',
        controls: false,
        loop: false,
        nav: false,
        slideBy: 'page',
        lazyload: true
    }
    let navs = []

    import { makeCSS } from 'svelte-css-in-js'

    export let navItemNotActiveColor = '#adadad'
    export let navItemActiveColor = '#3fd665'

    export let style = {
        'carousel-container': {
            width: '100%',
            height: '100%',
        },
        'tns-nav': {
            textAlign: 'center',
            margin: '10px 0',
            position: 'relative',
            top: '-40px',
        },
        'tns-nav-item': {
            width: '9px',
            height: '9px',
            padding: '0',
            margin: '0 5px',
            borderRadius: '50%',
            background: navItemNotActiveColor,
            border: '0',
            '.tns-nav-active': {
                background: navItemActiveColor,
            }
        },
    }
    export let theme = {
        'carousel-container': {},
        'tns-nav': {},
        'tns-nav-item': {},
    }

    import * as svelte from 'svelte'
    const css = makeCSS({ style, theme, svelte })
    console.log('css', css)

    onMount(async () => {
        try {
            if(!slider){
                if(navContainer && !options.navContainer) options.navContainer = navContainer
                console.log('check', navContainer, options)
                slider = tns({
                    container,
                    ...options,
                })
            }else{
                slider.refresh()
            }
        } catch (e) {}
        await tick()
        if(slider){
            for(let i=1; i <= slider.getInfo().slideCount; i++)
                navs.push(null)
            navs = navs
        }
    })

    onDestroy(() => {
        if (slider && slider.destroy) {
            slider.destroy()
            slider = undefined
        }
    })
</script>

<div class={css['carousel-container']} bind:this={container}>
    <slot />
</div>

<div class={css["tns-nav"]} bind:this={navContainer}>
    {#if options.nav}
        {#if navs.length > 0}
            {#each navs as nav, index}
                {#if index == 0}
                    <button class='{css['tns-nav-item']} tns-nav-active'></button>
                {:else}
                    <button class={css['tns-nav-item']}></button>
                {/if}
            {/each}
        {:else}
            <button></button>
        {/if}
    {/if}
</div>

<style>
    .carousel-container {
        width: 100%;
        height: 100%;
    }
</style>
