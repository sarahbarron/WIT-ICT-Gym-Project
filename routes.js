~"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const home = require("./controllers/home.js");
const assessment = require("./controllers/assessments.js")


router.get("/", home.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/dashboard", dashboard.memberDashboard);
router.get("/delete/assessment/:id", assessment.deleteAssessment);
router.post("/addassessment", assessment.addAssessment);
router.get("/about", about.index);

module.exports = router;