<script>
    import * as svelte from 'svelte'
    import { makeCSS } from 'svelte-css-in-js'

    export let type = 'text'
    export let value = ''
    export let placeHolder = ''
    export let disabled = undefined

    export let enter = undefined
    export let keyDown = undefined
    export let input = undefined
    export let etc = {}

    export let style = {}
    export let theme = {}

    const css = makeCSS({ style, theme, svelte })
</script>

<input
    this
    value={value}
    type={type}
    placeholder={placeHolder}
    disabled={disabled}
    class='{css}'
    {...etc}

    on:input={(event)=>{
        if(type != 'file'){
            value = type.match(/^(number|range)$/)
                ? +event.target.value
                : event.target.value
        }
        if(type == 'file') enter()
        if(typeof input == 'function') input(event)
    }}
    on:keydown={(event)=>{
        if(typeof keyDown == 'function') keyDown(event)
        if(typeof enter == 'function'
            && event.keyCode == 13) enter(value)
    }}
/>