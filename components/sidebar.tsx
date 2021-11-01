import {useState} from "react";
import useSWR from "swr";

import {oid, relation, addChildrenToRelation, removeChildrenFromRelation} from "../interfaces/oid";
import {fetcher, getOIDChildren} from "../api/api";

function Sidebar(props: { sidebar: string; updateSidebar: (sidebarState: string) => void; relation: relation; targetOID: string; }) {
    const [relation, updateRelation] = useState(props.relation)

    const addChildren = (parent: oid, children: oid[]) => {
        updateRelation(addChildrenToRelation(relation, parent, children))
    }

    const removeChildren = (parent: oid) => {
        updateRelation(removeChildrenFromRelation(relation, parent))
    }

    return (
        <div
            className={`fixed left-0 top-0 flex items-center h-screen z-10 ${props.sidebar === "closed" ? "w-0" : "w-2/5"}`}>
            <div
                className={`ml-[-2px] h-2/3 overflow-auto bg-white shadow-xl border-r-2 border-t-2 border-b-2 z-10 w-full`}>
                <div className={"py-4 px-5"}>
                    <h1 className={"text-2xl pb-3"}>
                        Navigator
                    </h1>
                    <SidebarEntry relation={relation} addChildren={addChildren} removeChildren={removeChildren}
                                  targetOID={props.targetOID}/>
                </div>
            </div>
            <button className={`pl-2 ${props.sidebar === "closed" ? "" : "rotate-180"}`}
                    onClick={() => props.updateSidebar(props.sidebar === "closed" ? "open" : "closed")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    )
}

function SidebarEntry(props: { relation: relation; addChildren: (parent: oid, children: oid[]) => void; removeChildren: (parent: oid) => void; targetOID: string }) {
    const [expanded, updateExpanded] = useState(false)

    const updateChildren = async () => {
        if (expanded) {
            props.removeChildren(props.relation.oid)
        } else {
            try {
                props.addChildren(props.relation.oid, await fetcher(getOIDChildren(props.relation.oid.oid)))
            } catch {
                // if there are no children do nothing
            }
        }
        updateExpanded(!expanded)
    }

    return (
        <div>
            <div>
                <button onClick={updateChildren} className={"w-4"}>
                    {expanded ? "-" : "+"}
                </button>
                <a href={`/oids/${props.relation.oid.oid}`}
                   className={`${props.targetOID == props.relation.oid.oid ? "font-bold" : ""}`}>
                    {props.relation.oid.oid} ({props.relation.oid.name})
                </a>
            </div>
            {props.relation.children &&
            <div className={"ml-2"}>
                {props.relation.children.map((children, index) => (
                    <SidebarEntry key={index} relation={children} addChildren={props.addChildren}
                                  removeChildren={props.removeChildren} targetOID={props.targetOID}/>
                ))}
            </div>}
        </div>
    )
}

export default Sidebar