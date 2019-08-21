~"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const home = require("./controllers/home.js");
const assessment = require("./controllers/assessments.js")
const trainerDashboard = require("./controllers/trainerdashboard.js");
const goals = require("./controllers/goal");

router.get("/", home.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/member-dashboard", dashboard.memberDashboard);
router.get("/delete-assessment/:id", assessment.deleteAssessment);
router.post("/add-assessment", assessment.addAssessment);
router.get("/member-profile", accounts.profile);
router.post("/update-members-profile", accounts.updateMemberProfile);

router.get("/trainer-dashboard", trainerDashboard.index);
router.get("/member/:id", trainerDashboard.getMemberDetails);
router.get("/trainer-profile", accounts.trainerProfile);
router.get("/delete-member/:id", trainerDashboard.deleteMember);
router.post("/update-trainers-profile", accounts.updateTrainerProfile);
router.post("/member/:memberid/add-comment-assessment/:id", assessment.addComment);

router.post("/add-goal/:memberid", goals.addGoal);
router.get("/member/:memberid/delete-goal/:id", goals.deleteGoal);

router.get("/about", about.index);

module.exports = router;