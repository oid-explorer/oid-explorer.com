import Head from 'next/head'
import {useState} from "react";

import Sidebar from "../../components/sidebar";
import {oid, relation} from "../../interfaces/oid";
import {fetcher, getOID, getOIDRelation} from "../../api/api";

export default function OID(props: { oid: oid; relation: relation; }) {
    const [sidebar, updateSidebar] = useState("closed")

    return (
        <>
            <Head>
                <title>OID Explorer | {props.oid.name}</title>
            </Head>
            <div>
                <div className={`px-48 py-10 flex flex-col gap-5 ${sidebar === "closed" ? "" : "opacity-30"}`}>
                    <h1 className={"text-3xl"}>
                        {props.oid.name}
                    </h1>
                    <h2 className={"text-2xl"}>
                        {props.oid.oid}
                    </h2>
                    {props.oid.descriptions &&
                    props.oid.descriptions.map((description, i) => (
                        <div key={i} className={"flex flex-col gap-2"}>
                            <h3 className={"text-xl"}>
                                Description from {description.mib}
                            </h3>
                            <p>
                                {description.description}
                            </p>
                        </div>
                    ))}
                </div>
                <Sidebar sidebar={sidebar}
                         updateSidebar={updateSidebar}
                         relation={props.relation}
                         targetOID={props.oid.oid}/>
            </div>
        </>
    )
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: "blocking",
    }
}

export async function getStaticProps({params}: { params: { oid: string } }) {
    try {
        return {
            props: {
                oid: await fetcher(getOID(params.oid)),
                relation: await fetcher(getOIDRelation(params.oid)),
            }
        }
    } catch {
        return {
            notFound: true,
        }
    }
}
