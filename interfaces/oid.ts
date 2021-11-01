export interface oid {
    name: string;
    oid: string;
    objectType?: string;
    descriptions?: {
        mib: string;
        description: string
    }[];
}

export function compareOIDs(a: oid, b: oid): number {
    let aSplit = a.oid.split(".")
    let bSplit = b.oid.split(".")

    for (let i = 0; i < aSplit.length; i++) {
        if (i >= bSplit.length) {
            return 1
        }

        if (Number(aSplit[i]) < Number(bSplit[i])) {
            return -1
        } else if (Number(aSplit[i]) > Number(bSplit[i])) {
            return 1
        }
    }

    if (aSplit.length < bSplit.length) {
        return -1
    }

    return 0
}

export interface relation {
    oid: oid;
    children: relation[];
}

export function addChildrenToRelation(relation: relation, parent: oid, children: oid[]): relation {
    // skip if relation does not start with parent
    if (relation.oid.oid != parent.oid.split(".").splice(0, relation.oid.oid.split(".").length).join(".")) {
        return relation
    }

    if (relation.oid.oid == parent.oid) {
        return addChildren(relation, children)
    }

    let newChildren = []
    for (let child of relation.children) {
        newChildren.push(addChildrenToRelation(child, parent, children))
    }

    return {
        oid: relation.oid,
        children: newChildren
    }
}

function addChildren(relation: relation, children: oid[]): relation {
    let res: relation = {
        oid: relation.oid,
        children: [],
    }

    if (relation.children != null) {
        for (let child of relation.children) {
            res.children.push(child)
        }
    }

    out:
        for (let child of children) {
            for (let existingChild of res.children) {
                if (child.oid == existingChild.oid.oid) {
                    continue out
                }
            }
            res.children.push({
                oid: child,
                children: [],
            })
        }

    res.children.sort(function (a, b) {
        return compareOIDs(a.oid, b.oid)
    })

    return res
}

export function removeChildrenFromRelation(relation: relation, parent: oid): relation {
    // skip if relation does not start with parent
    if (relation.oid.oid != parent.oid.split(".").splice(0, relation.oid.oid.split(".").length).join(".")) {
        return relation
    }

    if (relation.oid.oid == parent.oid) {
        return {
            oid: relation.oid,
            children: [],
        }
    }

    let newChildren = []
    for (let child of relation.children) {
        newChildren.push(removeChildrenFromRelation(child, parent))
    }

    return {
        oid: relation.oid,
        children: newChildren
    }
}