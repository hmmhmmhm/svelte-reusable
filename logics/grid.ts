// @ts-ignore
import _gridHelper from 'svelte-grid/build/helper/index'
import { tick } from 'svelte'

export interface IGridOptionDrag {
    top?: any
    left?: any
    dragging?: boolean
}
export interface IGridOptionResize {
    width?: any
    height?: any
    resizing?: boolean
}
export interface IGridOptionResponsive {
    valueW: number
}
export interface IGridOptionSize {
    w: any
    h: any
}
export interface IGridItem {
    x?: number
    y?: number
    w?: number
    h?: number
    drag?: IGridOptionDrag
    resize?: IGridOptionResize
    responsive?: IGridOptionResponsive
    draggable?: boolean
    resizable?: boolean
    max?: IGridOptionSize
    min?: IGridOptionSize
    static?: boolean

    id?: string
    component?
    background?
    props?
}
export interface IGridOption {
    items: IGridItem[]
    cols: number
    gap: number
    rowHeight: number
    breakpoints: any
    dragDebounceMs: number
    useTransform: boolean
    fillEmpty: boolean
}

export interface IGridPosition {
    x: number
    y: number
}

interface IGridHelper {
    /**
     * Returns an object with the properties necessary to create a widget
     * This is actually an object for a single widget
     */
    item: (item: IGridItem) => IGridItem

    /**
     * Find out where to place the widget in the grid by calculating from
     * left to right returns an object of two properties x and y.
     * You need to assign the returned result and
     * then only concat it with an array of objects
     *
     * @example
     * { x: Number, y: Number}
     */
    findSpaceForItem: (
        item: IGridItem,
        items: IGridItem[],
        cols: number
    ) => IGridPosition

    /**
     * Returns an array of objects, including an item
     * that should have been added to your grid.
     * You need to find another place for them too.
     */
    appendItem: (
        item: IGridItem,
        items: IGridItem[],
        cols: Number
    ) => IGridItem[]

    /**
     * Returns the array of objects
     * This is mainly used to keep your grid responsive.
     * It will find a new location and resize the widget based on the column size
     */
    resizeItem: (item: IGridItem, cols: number, rows: number) => IGridItem[]
}

export interface IGridLayerOption {
    component?
    w?: number
    h?: number
    option?: IGridOption
    props?
    x?: number
    y?: number
    item?: IGridItem
    background?: string
}

const gridHelper: IGridHelper = _gridHelper
export const GridHelper = {
    ...gridHelper,

    /**
     * Automatically populates the components
     * in the layout with the remaining free space.
     */
    addComponentManually: (
        item: IGridItem,
        items: IGridItem[],
        cols: number,
        x?: number,
        y?: number,
    ) => {
        if(x !== undefined && y !== undefined){
            items = [...items, ...[{ ...item, ...{x, y} }]]
        } else {
            let findOutPosition = GridHelper.findSpaceForItem(item, items, cols)
            items = [...items, ...[{ ...item, ...findOutPosition }]]
        }
        GridHelper.touchScrollAllow()
        return items
    },

    randomId: () =>
        '_' +
        Math.random()
            .toString(36)
            .substr(2, 9),

    add: ({
        component,
        w,
        h,
        option,
        props = {},

        item = {},
        background,
        x = undefined,
        y = undefined,
    }: {
        component
        w: number
        h: number
        option: IGridOption
        props?

        item?: IGridItem
        background?: string
        x?: number
        y?: number
    }) => {
        option.items = GridHelper.addComponentManually(
            GridHelper.item({
                ...item,
                w,
                h,
                props,

                id: GridHelper.randomId(),
                component,
                background: background ? background : '#ffffff',
            }),
            option.items,
            option.cols,
            x,
            y,
        )
        return option.items
    },

    layout: (layerOption: IGridLayerOption) => {
        return (addOption: IGridLayerOption) => {
            // @ts-ignore
            GridHelper.add({
                ...layerOption,
                ...addOption,
            })
        }
    },

    /**
     * @example
     * {
     *       items: [],
     *       cols: 1000,
     *       gap: 10,
     *       rowHeight: 1,
     *       breakpoints: [],
     *       dragDebounceMs: 350,
     *       useTransform: false,
     *       fillEmpty: true,
     *   }
     */
    getDefaultOptions: () => {
        return {
            items: [],
            cols: 1000,
            gap: 10,
            rowHeight: 1,
            breakpoints: [],
            dragDebounceMs: 350,
            useTransform: false,
            fillEmpty: true,
        }
    },

    touchScrollAllow: async () => {
        await tick()
        for (let elm of document.querySelectorAll('.svlt-grid-item')) {
            // @ts-ignore
            elm.style.touchAction = 'auto'
        }
    },
}
