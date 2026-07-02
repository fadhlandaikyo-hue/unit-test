import { prismaClient } from "../application/database.js";

// GET /api/projects/:id/checklist
export const getChecklist = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({ errors: "project id is invalid" });
        }

        const data = await prismaClient.inspectionChecklist.findUnique({
            where: { project_id: projectId }
        });

        res.json({
            data: {
                project_id: projectId,
                inspector:  data?.inspector ?? "",
                checked:    data?.checked   ?? {},
                saved_at:   data?.saved_at  ?? null,
            }
        });
    } catch (e) {
        next(e);
    }
};

// PATCH /api/projects/:id/checklist
export const saveChecklist = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({ errors: "project id is invalid" });
        }

        const { checked, inspector } = req.body;

        if (!checked || typeof checked !== "object" || Array.isArray(checked)) {
            return res.status(400).json({ errors: "checked must be an object" });
        }

        const data = await prismaClient.inspectionChecklist.upsert({
            where:  { project_id: projectId },
            update: { checked, inspector: inspector ?? null },
            create: { project_id: projectId, checked, inspector: inspector ?? null },
        });

        res.json({ data });
    } catch (e) {
        next(e);
    }
};
