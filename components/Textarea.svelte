<script>
    import * as svelte from 'svelte'
    import { makeCSS } from 'svelte-css-in-js'

    export let type = 'text'
    export let value = ''
    export let placeHolder = ''
    export let disabled = undefined
    export let etc = {}

    export let style = {}
    export let theme = {}

    const css = makeCSS({ style, theme, svelte })
</script>

<textarea
    this
    value={value}
    type={type}
    placeholder={placeHolder}
    disabled={disabled}
    class='{css}'
    {...etc}

    on:input
    on:keydown
/>