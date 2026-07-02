

export function useProgressDrag() {
    let activeProject = null
    let trackElement = null


    function calcProgress(clientX) {
        const rect = trackElement.getBoundingClientRect()
        const ratio = (clientX - rect.left) / rect.width
        return Math.min(100, Math.max(0, Math.round(ratio * 100)))
    }

    function onMouseMove(e) {
        if (!activeProject) return
        activeProject.progress = calcProgress(e.clientX)
    }

    function onTouchMove(e) {
        e.preventDefault()
        if (!activeProject) return
        activeProject.progress = calcProgress(e.touches[0].clientX)
    }

    function onEnd() {
        activeProject = null
        trackElement = null
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onEnd)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('touchend', onEnd)
    }


    function startDrag(event, project) {
        activeProject = project
        trackElement = event.currentTarget

        const clientX = event.touches ? event.touches[0].clientX : event.clientX
        activeProject.progress = calcProgress(clientX)

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onEnd)
        window.addEventListener('touchmove', onTouchMove, { passive: false })
        window.addEventListener('touchend', onEnd)
    }

    return { startDrag }
}

