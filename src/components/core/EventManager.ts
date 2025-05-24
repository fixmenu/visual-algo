import {Subject} from "rxjs";
import AlgorithmEvent from "@/components/core/AlgorithmEvent"; // Assuming this path is correct from project setup

export default class EventManager {
    private _subject: Subject<AlgorithmEvent>;
    private _isPaused: boolean = false;

    constructor() {
        this._subject = new Subject<AlgorithmEvent>();
    }

    emit(key: string, value: any) {
        if (this._isPaused) {
            console.log('EventManager is paused. Event emission skipped for key:', key);
            return;
        }
        if (!this._subject.closed) {
            this._subject.next({key, value});
        } else {
            console.warn('Attempted to emit event on a closed EventManager subject for key:', key);
        }
    }

    get observable() {
        return this._subject.asObservable();
    }

    public destroy(): void {
        if (!this._subject.closed) {
            this._subject.complete();
        }
        // this._subject.unsubscribe(); // Generally not needed if only used as an emitter
        console.log('EventManager destroyed. Subject completed.');
    }

    public pause(): void {
        this._isPaused = true;
        console.log('EventManager pause called. Event emission paused.');
    }

    public resume(): void {
        this._isPaused = false;
        console.log('EventManager resume called. Event emission resumed.');
    }

    public completeIfSilent(): void {
        setTimeout(() => {
            if (!this._subject.closed) {
                console.log('EventManager: completeIfSilent called, completing subject.');
                this._subject.complete();
            } else {
                console.log('EventManager: completeIfSilent called, but subject already closed.');
            }
        }, 0); // Delay of 0 ms to queue this after current execution block
    }
}
