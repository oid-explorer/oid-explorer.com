const apiURL = "https://api.oid-explorer.com"

export async function fetcher(url: RequestInfo) {
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(await res.json())
    }

    return res.json()
}

export function searchOID(keyword: string, type: string = "any", limit: number = 10): string {
    return `${apiURL}/oids?keyword=${keyword}&type=${type}&limit=${limit}`
}

export function getOIDs(): string {
    return `${apiURL}/oids`
}

export function getOID(oid: string): string {
    return `${apiURL}/oids/${oid}`
}

export function getOIDRelation(oid: string): string {
    return `${apiURL}/oids/${oid}/relation`
}

export function getOIDParent(oid: string): string {
    return `${apiURL}/oids/${oid}/parent`
}

export function getOIDSiblings(oid: string): string {
    return `${apiURL}/oids/${oid}/siblings`
}

export function getOIDChildren(oid: string): string {
    return `${apiURL}/oids/${oid}/children`
}