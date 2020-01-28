<script>
    import { makeCSS } from 'svelte-css-in-js'

    export let value = ''
    export let placeHolder = ''
    export let disabled = undefined
    export let etc = {}

    export let style = {
        textarea: {},
    }
    export let theme = {
        textarea: {},
    }

    const css = makeCSS({ style, theme })
</script>

<textarea
    this
    bind:value
    placeholder={placeHolder}
    {disabled}
    class="textarea {css.textarea}"
    {...etc}
    on:input
    on:keydown
/>
