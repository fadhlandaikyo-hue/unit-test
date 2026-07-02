import {prismaClient} from "../application/database.js";

export const getProgress = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id)
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({ errors: "project id is invalid" })
        }

        const data = await prismaClient.projectProgress.findUnique({
            where: { project_id: projectId }
        })
        res.json({ data: { progress: data?.progress ?? 0 } })
    } catch (e) {
        next(e)
    }
}

export const updateProgress = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id)
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({ errors: "project id is invalid" })
        }

        const progress = Number(req.body.progress)
        if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
            return res.status(400).json({ errors: "progress must be number 0..100" })
        }
        const roundedProgress = Math.round(progress * 10) / 10

        const data = await prismaClient.projectProgress.upsert({
            where:  { project_id: projectId },
            update: { progress: roundedProgress },
            create: { project_id: projectId, progress: roundedProgress }
        })
        res.json({ data })
    } catch (e) {
        next(e)
    }
}