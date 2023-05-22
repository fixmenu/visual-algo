import React, {useEffect, useState} from 'react';
import EventManager from "@/components/core/EventManager";
import ObsArray from "@/components/core/ObsArray";
import {concatMap, delay, of} from "rxjs";
import ObsVar from "@/components/core/ObsVar";

export default function useBubbleSort(initialArray: number[]) {
    const [state, setState] = useState<{ i: number, j: number, array: number[] }>({i: 0, j: 0, array: initialArray})

    useEffect(() => {
        const em = new EventManager();
        const sub = em.observable.pipe(
            concatMap(state => of(state).pipe(delay(1000)))
        ).subscribe(event => {  // changed state to arrayState for clarity
            console.log(event)
            setState((prevState) => ({...prevState, [event.key]: event.value}))
            console.log(state)
        });

        bubbleSort(em)

        return () => {
            sub.unsubscribe()
        }
    },[])

    const bubbleSort = async (eventManager: EventManager) => {
        const obsArray = new ObsArray('array', [...initialArray], eventManager)
        const i = new ObsVar('i', 0, eventManager)
        const j = new ObsVar('j', 0, eventManager)

        let arr = obsArray.array;
        let len = arr.length;
        for (i.value = 0; i.value < len; i.value++) {
            for (j.value = 0; j.value < len - i.value - 1; j.value++) {
                if (arr[j.value] > arr[j.value + 1]) {
                    let temp = arr[j.value];
                    arr[j.value] = arr[j.value + 1];
                    arr[j.value + 1] = temp;
                }
            }
        }
    };

    return state;
}
