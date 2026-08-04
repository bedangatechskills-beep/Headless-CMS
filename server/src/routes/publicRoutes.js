import { Router } from "express";
import Project from "../models/projects.js";

const router = Router();

// GET /api/projects  — published only; optional ?tag=web  ?featured=true
router.get("/projects", async (req, res, next) => {
  try {
    const filter = { status: "published" };
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.featured === "true") filter.featured = true;
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});


// GET /api/projects/:slug — one published project
router.get("/projects/:slug", async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      status: "published"
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

export default router;