import { Router } from "express";
import Project from "../models/projects.js";
import Service from "../models/service.js";
import TeamMember from "../models/teamMember.js";
import Testimonial from "../models/testimonial.js";
import SiteSettings from "../models/siteSettings.js";

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

// GET /api/services — sorted by manual displayOrder
router.get("/services", async (req, res, next) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
});

// GET /api/team
router.get("/team", async (req, res, next) => {
  try {
    const team = await TeamMember.find().sort({ createdAt: 1 });
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// GET /api/testimonials
router.get("/testimonials", async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
});

// GET /api/settings — the singleton; {} until it's first created
router.get("/settings", async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne();
    res.json(settings || {});
  } catch (err) {
    next(err);
  }
});

export default router;