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
            display: 'block',
            width: '100%',
            minHeight: '100%',
            background: 'unset',
            borderStyle: 'none',
            resize: 'none',
            padding: '0',
            margin: '0',
            fontSize: '15px',
        },
    }
    export let theme = {
        textarea: {},
    }

    const css = makeCSS({ style, theme })

    const recalculateHeight = value => {
        if (element && element.style) {
            // Adjust the height according to the font size.
            let fontSize = Number(style.textarea.fontSize.replace('px', ''))
            let diff = fontSize / 17

            element.style.height = '1px'
            element.style.height = element.scrollHeight * diff + 'px'
        }
    }

    // Render it when the value has been changed.
    $: recalculateHeight(value)

    // And Mount Time.
    onMount(recalculateHeight)
</script>

<textarea
    bind:this={element}
    value={`${value}${value}${value}${value}${value}`}
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
