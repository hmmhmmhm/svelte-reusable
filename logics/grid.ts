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
        autoPosition: boolean = true,
        x?: number,
        y?: number,
    ) => {
        if(autoPosition){
            let findOutPosition = GridHelper.findSpaceForItem(item, items, cols)
            items = [...items, ...[{ ...item, ...findOutPosition }]]
        } else if(!autoPosition && x && y){
            items = [...items, ...[{ ...item, ...{x, y} }]]
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

        item = {},
        background,
        x = undefined,
        y = undefined,
    }: {
        component
        w: number
        h: number

        option: IGridOption

        item?: IGridItem
        background?: string
        x?: number,
        y?: number
    }) => {
        option.items = GridHelper.addComponentManually(
            GridHelper.item({
                ...item,
                x,
                y,
                w,
                h,

                id: GridHelper.randomId(),
                component,
                background: background ? background : '#ffffff',
            }),
            option.items,
            option.cols
        )
        return option.items
    },

    getDefaultOptions: () => {
        return {
            items: [],
            cols: 5,
            gap: 10,
            rowHeight: 100,
            breakpoints: [
                [800, 3],
                [530, 1],
            ],
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
