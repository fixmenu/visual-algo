import {delay, Observable, Subject} from "rxjs";
import {useEffect, useState} from "react";

export interface NodeType<T> {
    index: number
    visited: boolean,
    value: T
}

