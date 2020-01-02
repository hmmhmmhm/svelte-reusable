<svelte:head>
    <style>
        .tns-nav {
            text-align: center;
            margin: 10px 0;
        }
        .tns-nav > [aria-controls] {
            width: 9px;
            height: 9px;
            padding: 0;
            margin: 0 5px;
            border-radius: 50%;
            background: #adadad;
            border: 0;
        }
        .tns-nav > .tns-nav-active { background: #3fd665; }
        .tns-nav {
            position: relative;
            top: -40px;
        }
    </style>
</svelte:head>

<script>
    import { tns } from 'tiny-slider/src/tiny-slider'
    import { onMount, onDestroy, tick } from 'svelte'

    export let container
    export let slider
    export let options = {
        mouseDrag: true,
        autoWidth: true,
        autoHeight: false,
        mode: 'carousel',
        controls: false,
        loop: false,
        nav: false,
        slideBy: 'page',
        preventScrollOnTouch: 'auto',
        lazyload: true,
    }

    onMount(async () => {
        await tick()
        try {
            slider = tns({
                container,
                ...options,
            })
        } catch (e) {}
        await tick()
    })
    onDestroy(() => {
        if (slider && slider.destroy) {
            slider.destroy()
            slider = undefined
        }
    })
</script>

<div class="carousel-container" bind:this={container}>
    <slot />
</div>

<style>
    .carousel-container {
        width: 100%;
        height: 100%;
    }
</style>
