"use strict";

const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const accounts = require("./accounts");
const uuid = require("uuid");

const assessment = {

    deleteAssessment(request, response) {
        const assessmentId = request.params.id;
        logger.info("deleting assessment: ", assessmentId);
        assessmentStore.removeAssessment(assessmentId);
        response.redirect("/member-dashboard");
    },

    addAssessment(request, response) {
        const loggedInMember = accounts.getCurrentMember(request);
        const newAssessment = {
            id: uuid(),
            memberid: loggedInMember.id,
            date: new Date().toLocaleString('ie-IE'),
            weight: request.body.weight,
            chest: request.body.chest,
            thigh: request.body.thigh,
            upperarm: request.body.upperarm,
            waist: request.body.waist,
            hip: request.body.hip
        }
        logger.debug("New Assessment = ", newAssessment);
        assessmentStore.addAssessment(newAssessment);
        response.redirect("/member-dashboard");
    },

    addComment(request, response) {
        logger.info("Adding a comment");
        const id = request.params.memberid;
        const assessmentid = request.params.id;
        const comment = request.body.comment;
        assessmentStore.addComment(assessmentid, comment);
        // response.redirect("/trainer-dashboard");
        response.redirect(`/member/${id}`);
    }
};

module.exports = assessment;