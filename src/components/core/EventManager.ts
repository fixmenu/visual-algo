import {Subject} from "rxjs";
import AlgorithmEvent from "@/components/core/AlgorithmEvent";

export default class EventManager {
    private _subject: Subject<AlgorithmEvent>

    constructor() {
        this._subject = new Subject<AlgorithmEvent>()
    }

    emit(key: string, value: any) {
        this._subject.next({key, value})
    }

    get observable() {
        return this._subject.asObservable()
    }
}
