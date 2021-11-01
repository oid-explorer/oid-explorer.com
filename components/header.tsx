import {useState} from "react";
import useSWR from "swr";
import {fetcher, searchOID} from "../api/api";

function Header() {
    const [keyword, setKeyword] = useState("")

    return (
        <div className={"relative flex border-b-2 items-center px-48 py-8 gap-14 z-30 bg-white"}>
            <h1 className={"text-3xl"}>
                <a href={"/"}>
                    OID Explorer
                </a>
            </h1>
            <div className={"flex flex-1 gap-10"}>
                <div className={"transform hover:scale-110 ease-in-out duration-100"}>
                    <a href={"/faq"}>
                        FAQ
                    </a>
                </div>
                <div className={"transform hover:scale-110 ease-in-out duration-100"}>
                    <a href={"https://github.com/oid-explorer"}>
                        GitHub
                    </a>
                </div>
            </div>
            <div>
                <input className={"border-2 text-sm rounded p-0.5 focus:outline-none focus:border-gray-300"}
                       placeholder={"Search..."} autoComplete={"off"}
                       onChange={(event) => setKeyword(event.target.value)}/>
                {keyword !== "" &&
                <SearchResult keyword={keyword}/>
                }
            </div>
        </div>
    )
}

function SearchResult(props: { keyword: string; }) {
    const {data, error} = useSWR(searchOID(props.keyword), fetcher)

    return (
        <ul className={"fixed bg-white border-2 rounded shadow-xl mt-1 px-2 py-1"}>
            {error
                ? <li key={0} className={"mx-1 my-2"}>
                    No Result!
                </li>
                : !data
                    ? <li key={0} className={"mx-1 my-2"}>
                        Loading...
                    </li>
                    : data.map((result: { oid: string; name: boolean }, i: number) => (
                        <li key={i} className={"m-1"}>
                            <a href={`/oids/${result.oid}`}>
                                {result.name}
                            </a>
                        </li>
                    ))
            }
        </ul>
    )
}

export default Header
