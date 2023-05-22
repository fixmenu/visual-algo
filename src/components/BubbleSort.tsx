import React, {useEffect, useState} from 'react';
import {concatMap, delay, of, Subscription} from "rxjs";
import ObsArray from "@/components/core/ObsArray";
import EventManager from "@/components/core/EventManager";
import ObsVar from "@/components/core/ObsVar";
import AlgorithmEvent from "@/components/core/AlgorithmEvent";
import useBubbleSort from "@/components/hooks/useBubbleSort";

const eventManager = new EventManager()
export default function BubbleSort() {
    const initialArray = [5, 2, 4, 6, 1, 3];  // Replace with your actual initial array
    const state = useBubbleSort(initialArray);


    return (
        <div>
            <div>i: {state.i}</div>
            <div>j: {state.j}</div>
            <div>Array: {state.array.join(', ')}</div>
        </div>
    );
}
