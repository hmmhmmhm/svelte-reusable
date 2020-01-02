<script>
    export let type = 'button'
    export let value = ''
    export let label = ''
    export let name = ''
    export let disabled = undefined
    export let etc = {}

    export let style = {
        default: {
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
        default: {},
        label: {},
    }

    import { makeCSS } from 'svelte-css-in-js'
    const css = makeCSS({ style, theme })
</script>

<button class={css.default} on:click {type} {disabled} {value} {name} {...etc}>
    <p class={css.label}>{label}</p>
</button>
