import EventManager from "@/components/core/EventManager";

export default class ObsArray<T> {
    private _array: T[];
    private _eventManager: EventManager;
    private _key: string;

        constructor(key: string, items: T[], eventManager: EventManager) {
            this._key = key;
            this._eventManager = eventManager;
            this._array = new Proxy(items, {
                set: (target, property, value) => {
                    // @ts-ignore
                    target[property] = value;
                    this._eventManager.emit(this._key, [...target]);
                    return true;
                },
                get: (target, property) => {
                    // @ts-ignore
                    return target[property];
                }
            });
        }

        get array(): T[] {
            return this._array;
        }
}
