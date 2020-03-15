import { Notification } from 'svelma'
type NotificationType =
    | 'is-white'
    | 'is-black'
    | 'is-light'
    | 'is-dark'
    | 'is-primary'
    | 'is-info'
    | 'is-success'
    | 'is-warning'
    | 'is-danger'

export const notification = (
    message: string,
    type: NotificationType,
    duration: number = 4000,
    props?
) => {
    const actualProps = {
        type,
        duration,
        ...props,
    }
    Notification.create({ message, ...actualProps })
}