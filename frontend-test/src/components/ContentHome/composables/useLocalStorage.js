const apiUrl = import.meta.env.VITE_API_PATH || "/api"

export function useLocalStorage() {
    async function saveOne(id, progress) {
        const res = await fetch(`${apiUrl}/projects/${id}/progress`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progress })
        })
        if (!res.ok) {
            throw new Error(`Failed to save progress (${res.status})`)
        }
    }

    async function getOne(id, defaultValue = 0) {
        try {
            const res = await fetch(`${apiUrl}/projects/${id}/progress`)
            if (!res.ok) {
                return defaultValue
            }
            const data = await res.json()
            return data.data?.progress ?? defaultValue
        } catch {
            return defaultValue
        }
    }

    async function saveProjectDate(id, startDate, endDate) {
        const res = await fetch(`${apiUrl}/projects/${id}/date`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate, endDate })
        })
        if (!res.ok) {
            throw new Error(`Failed to save project date (${res.status})`)
        }
        const data = await res.json()
        return data.data
    }

    async function getProjectDate(id) {
        try {
            const res = await fetch(`${apiUrl}/projects/${id}/date`)
            if (!res.ok) {
                return null
            }
            const data = await res.json()
            return data.data
        } catch {
            return null
        }
    }

    return { saveOne, getOne, saveProjectDate, getProjectDate }
}
