<script>
    import * as svelte from 'svelte'
    import { makeCSS } from 'svelte-css-in-js'

    export let type = 'text'
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

    const css = makeCSS({ style, theme, svelte })
</script>

<textarea
    this
    {value}
    {type}
    placeholder={placeHolder}
    {disabled}
    class={css.default}
    {...etc}
    on:input
    on:keydown
/>
