<script>
    import { makeCSS } from 'svelte-css-in-js'

    export let type = 'text'
    export let value = ''
    export let placeHolder = ''
    export let disabled = undefined

    export let enter = undefined
    export let keyDown = undefined
    export let input = undefined
    export let change = undefined
    export let etc = {}
    export let element = undefined
    export let pattern = undefined

    export let style = {
        input: {},
    }
    export let theme = {
        input: {},
    }

    const css = makeCSS({ style, theme })
</script>

<input
    bind:this={element}
    {value}
    {type}
    placeholder={placeHolder}
    {disabled}
    class="input {css.input}"
    {...etc}
    on:input={event => {
        if (type != 'file') {
            value = type.match(/^(number|range)$/) ? +event.target.value : event.target.value
        }
        if (type == 'file') enter()
        if (typeof input == 'function') input(event)
    }}
    on:change={event => {
        const { target } = event
        if (type == 'file') {
            try {
                if (target.value.length > 0) {
                    enter(target.files)
                } else {
                    target.reset()
                }
            } catch (e) {}
        }
        if (typeof change == 'function') change(event)
    }}
    {pattern}
    on:keyup
    on:keydown={event => {
        if (typeof keyDown == 'function') keyDown(event)
        if (typeof enter == 'function' && event.keyCode == 13) enter(value)
    }}
/>
