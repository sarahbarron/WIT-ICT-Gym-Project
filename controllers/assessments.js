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
    }
};

module.exports = assessment;