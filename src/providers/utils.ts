import { Provider } from '@poty/core'
import _ from 'lodash'

@Provider()
export class UtilsProvider {

    dropEmpty(obj: any) {
        _.forOwn(obj, (v, k, o) => {
            if (_.isNil(v) || _.isNaN(v) || v === '') {
                delete obj[k]
            }
            if (_.isObject(v)) {
                this.dropEmpty(v)
            }
        })
        return obj
    }

}