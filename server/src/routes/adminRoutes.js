import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Project from "../models/project.js";
import Service from "../models/service.js";
import TeamMember from "../models/teamMember.js";
import Testimonial from "../models/testimonial.js";
import SiteSettings from "../models/siteSettings.js";

const router = Router();

// Every route in this file requires a valid JWT.
router.use(requireAuth);

// ---- Projects: written out in full (the teaching example) ----

// List ALL projects, drafts included (unlike the public route)
router.get("/projects", async (req, res, next) => {
  try {
    res.json(await Project.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.get("/projects/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.post("/projects", async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

router.put("/projects/:id", async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // return the updated document, not the old one
      runValidators: true  // apply schema rules on update too
    });
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.delete("/projects/:id", async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ---- The simpler types share one generic CRUD factory (DRY) ----
// In class you may hand-write these per type for practice; the factory
// shows how a real CMS treats content types as data.

function addCrudRoutes(path, Model, sort = { createdAt: -1 }) {
  router.get(`/${path}`, async (req, res, next) => {
    try {
      res.json(await Model.find().sort(sort));
    } catch (err) {
      next(err);
    }
  });

  router.get(`/${path}/:id`, async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json(doc);
    } catch (err) {
      next(err);
    }
  });

  router.post(`/${path}`, async (req, res, next) => {
    try {
      res.status(201).json(await Model.create(req.body));
    } catch (err) {
      next(err);
    }
  });

  router.put(`/${path}/:id`, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json(doc);
    } catch (err) {
      next(err);
    }
  });

  router.delete(`/${path}/:id`, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });
}

addCrudRoutes("services", Service, { displayOrder: 1 });
addCrudRoutes("team", TeamMember, { createdAt: 1 });
addCrudRoutes("testimonials", Testimonial);

// ---- Site settings: singleton, so only GET and PUT (upsert) ----

router.get("/settings", async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne();
    res.json(settings || {});
  } catch (err) {
    next(err);
  }
});

router.put("/settings", async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,        // create the singleton if it doesn't exist yet
      runValidators: true
    });
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

export default router;