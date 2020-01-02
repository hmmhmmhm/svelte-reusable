// @ts-ignore
import _gridHelper from 'svelte-grid/build/helper/index'

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

    /**
     * Automatically populates the components
     * in the layout with the remaining free space.
     */
    addComponent: (item: IGridItem, items: IGridItem[], cols: number) => IGridItem[]
}

export const GridHelper: IGridHelper = {
    ..._gridHelper,
    addComponent: (item: IGridItem, items: IGridItem[], cols: number) => {
        let findOutPosition = GridHelper.findSpaceForItem(item, items, cols)
        items = [...items, ...[{ ...item, ...findOutPosition }]]
        touchScrollAllow()
        return items
    }
}

import { tick } from 'svelte'
const touchScrollAllow = async () => {
    await tick()
    for (let elm of document.querySelectorAll('.svlt-grid-item')) {
        // @ts-ignore
        elm.style.touchAction = 'auto'
    }
}
