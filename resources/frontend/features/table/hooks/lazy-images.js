export function loadLazyImages(root) {
    const images = matchingElements(root, '.lazyload')

    images.forEach(loadLazyImage)

    return images.length
}

export function loadLazyImage(element) {
    if (element.tagName?.toLowerCase() === 'img') {
        element.loading = 'lazy'
        copyAttribute(element, 'data-src', 'src')
        copyAttribute(element, 'data-srcset', 'srcset')

        return
    }

    const source = element.getAttribute('data-src')
    if (source) {
        element.style.backgroundImage = `url(${JSON.stringify(source)})`
    }
}

function copyAttribute(element, source, target) {
    const value = element.getAttribute(source)
    if (value) {
        element.setAttribute(target, value)
    }
}

function matchingElements(root, selector) {
    const elements = [...root.querySelectorAll(selector)]
    if (typeof root.matches === 'function' && root.matches(selector)) {
        elements.unshift(root)
    }

    return elements
}
