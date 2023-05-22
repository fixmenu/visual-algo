import EventManager from "@/components/core/EventManager";

export default class ObsVar<T> {
    private _value: T
    private _eventManager: EventManager
    private _key: string

    constructor(key:string, value: T, eventManager:EventManager) {
        this._key = key
        this._value = value
        this._eventManager = eventManager
    }


    get value() {
        return this._value
    }

    set value(value:T) {
        this._value = value
        this._eventManager.emit(this._key,this._value)
    }
}
