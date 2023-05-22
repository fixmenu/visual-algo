import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Node from "@/components/Node";
import {delay, from, interval, map, Observable, observable, take} from "rxjs";
import {NodeType} from "@/rx/Node";
import {node} from "prop-types";

interface Prop {
    nodes: number[]
}
export default function NodeList() {
    const [nodes,setNodes] = useState<NodeType<number>[]>([])
    let obsNodes:NodeType<number>[] = []


    const runLogic = useMemo(() => {
        console.log("********RUNNED***********")
        let arr = [1,2,3,4,5]

        for (let i = 0; i < arr.length; i++) {
            nodes.push({
                index:i,
                visited: false,
                value: arr[i]
            })
        }

        setNodes(nodes)


        for (let i = 0; i < nodes.length; i++) {
            //visit each array node pass value to observable listen with interval
            obsNodes.push({
                index:i,
                visited: true,
                value: nodes[i].value
            })

            //visit each array node pass value to observable listen with interval
            if(i > 0)
            obsNodes.push({
                index:i-1,
                visited: false,
                value: nodes[i].value
            })
        }

        const source$ = interval(1000)
            .pipe(
                take(obsNodes.length),
                map(i => obsNodes[i])
            )

        const subscription = source$.subscribe(value => {
            console.log(value)

            let existingNode = nodes.findIndex(n => n.index == value.index)

            if(existingNode) {
                console.log("exist")
                nodes[existingNode] = value
                setNodes(nodes)
            }else{
                console.log("not exist")

                setNodes([...nodes,value])
            }

            console.log(nodes)
        })

        return () => {
            subscription.unsubscribe()
        }
    },[])

    return (
        <div className="flex">
            {
                nodes && nodes.map((n,i) => (
                    <Node key={i} node={n}/>
                ))
            }
            <button onClick={() => runLogic()}>Start</button>
        </div>
    );
}
