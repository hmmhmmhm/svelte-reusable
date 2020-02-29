<script>
    import { makeCSS } from 'svelte-css-in-js'
    import { onMount } from 'svelte'

    export let value = ''
    export let placeHolder = ''
    export let disabled = undefined
    export let etc = {}
    export let element = undefined
    export let pattern = undefined
    export let readonly = true

    export let style = {
        textarea: {
            width: '100%',
            background: 'unset',
            borderStyle: 'none',
        },
    }
    export let theme = {
        textarea: {},
    }

    const css = makeCSS({ style, theme })

    const recalculateHeight = (value)=> {
        if(element && element.style) {
            element.style.height = '1px'
            element.style.height = (12 + element.scrollHeight) + 'px'
        }
    }

    // Render it when the value has been changed.
    $: recalculateHeight(value)

    // And Mount Time.
    onMount(recalculateHeight)
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
    {readonly}
/>
