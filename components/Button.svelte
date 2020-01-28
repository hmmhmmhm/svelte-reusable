<script>
    export let type = 'button'
    export let value = ''
    export let label = ''
    export let name = ''
    export let disabled = undefined
    export let etc = {}

    export let style = {
        button: {
            width: '100%',
            borderStyle: 'none',
            fontWeight: '800',
            fontSize: '12px',
            ':focus': {
                outline: 'none',
            },
            ':active': {
                borderStyle: 'none',
            },
        },
        label: {
            display: 'inline-block',
            position: 'relative',
        },
    }
    export let theme = {
        button: {},
        label: {},
    }

    import { makeCSS } from 'svelte-css-in-js'
    const css = makeCSS({ style, theme })
</script>

<button class="button {css.button}" on:click {type} {disabled} {value} {name} {...etc}>
    <p class="label {css.label}">{label}</p>
</button>
