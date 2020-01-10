<script>
    import { makeCSS } from 'svelte-css-in-js'

    export let value = ''
    export let placeHolder = ''
    export let disabled = undefined
    export let etc = {}

    export let style = {
        default: {},
    }
    export let theme = {
        default: {},
    }

    const css = makeCSS({ style, theme })
</script>

<textarea
    this
    bind:value
    placeholder={placeHolder}
    {disabled}
    class={css.default}
    {...etc}
    on:input
    on:keydown
/>
