import { EventTypeHandler } from '../core/types'

const Handshake: EventTypeHandler = (val, _opts, callback) => {
    callback('version')
}

export const type = 'diff:handshake';

export default Handshake;