

export const deepElementFromPoint = (x, y) => {
    const el = document.elementFromPoint(x, y)

    const crawlShadows = node => {
        if (node.shadowRoot) {
            const potential = node.shadowRoot.elementFromPoint(x, y)

            if (potential == node) return node
            else if (potential.shadowRoot) return crawlShadows(potential)
            else return potential
        }
        else return node
    }

    const nested_shadow = crawlShadows(el)

    return nested_shadow || el
}
