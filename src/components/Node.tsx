import React from 'react';
import {NodeType} from "@/rx/Node";

export default function Node({node}:{node:NodeType<number>}) {
    return (
        <div className={`w-10 h-10 border-2 border-white flex justify-center items-center ${node.visited? 'bg-red-500':''}`}>
            <p>{node.value}</p>
        </div>
    );
}
