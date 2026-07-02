import {prismaClient} from "../application/database.js";

function parseProjectId(value) {
    const projectId = Number(value)
    return Number.isInteger(projectId) && projectId > 0 ? projectId : null
}

function parseISODate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null
    }

    const date = new Date(`${value}T00:00:00.000Z`)
    return Number.isNaN(date.getTime()) ? null : date
}

function formatISODate(value) {
    if (!value) return null
    return value.toISOString().slice(0, 10)
}

export const getProjectDate = async (req, res, next) => {
    try {
        const projectId = parseProjectId(req.params.id)
        if (!projectId) {
            return res.status(400).json({ errors: "project id is invalid" })
        }

        const data = await prismaClient.projectDate.findUnique({
            where: { project_id: projectId }
        })

        res.json({
            data: data
                ? {
                    project_id: data.project_id,
                    startDate: formatISODate(data.start_date),
                    endDate: formatISODate(data.end_date)
                }
                : null
        })
    } catch (e) {
        next(e)
    }
}

export const updateProjectDate = async (req, res, next) => {
    try {
        const projectId = parseProjectId(req.params.id)
        if (!projectId) {
            return res.status(400).json({ errors: "project id is invalid" })
        }

        const startDate = parseISODate(req.body.startDate)
        const endDate = parseISODate(req.body.endDate)
        if (!startDate || !endDate) {
            return res.status(400).json({ errors: "startDate and endDate must use YYYY-MM-DD format" })
        }
        if (startDate.getTime() > endDate.getTime()) {
            return res.status(400).json({ errors: "startDate must be before or equal to endDate" })
        }

        const data = await prismaClient.projectDate.upsert({
            where: { project_id: projectId },
            update: { start_date: startDate, end_date: endDate },
            create: { project_id: projectId, start_date: startDate, end_date: endDate }
        })

        res.json({
            data: {
                project_id: data.project_id,
                startDate: formatISODate(data.start_date),
                endDate: formatISODate(data.end_date)
            }
        })
    } catch (e) {
        next(e)
    }
}
