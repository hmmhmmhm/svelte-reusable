<script>
    import { makeCSS } from 'svelte-css-in-js'

    export let value = ''
    export let placeHolder = ''
    export let disabled = undefined
    export let etc = {}
    export let element = undefined
    export let pattern = undefined

    export let style = {
        textarea: {},
    }
    export let theme = {
        textarea: {},
    }

    const css = makeCSS({ style, theme })
</script>

<textarea
    bind:this={element}
    bind:value
    placeholder={placeHolder}
    {disabled}
    class="textarea {css.textarea}"
    {...etc}
    on:input
    {pattern}
    on:keyup
    on:keydown
/>
