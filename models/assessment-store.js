"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const assessmentStore = {

    store: new JsonStore("./models/assessment-store.json", {
        assessmentCollection: []
    }),
    collection: "assessmentCollection",


    // return all assessments in the assessment-store json file
    getAllAssessments() {
        return this.store.findAll(this.collection);
    },

    // return one assessment from the assessment-store json file where the id's match
    getAssessment(id) {
        return this.store.findOneBy(this.collection, {
            id: id
        });
    },

    // return all assessments for a particular member
    getMemberAssessments(memberid) {
        return this.store.findBy(this.collection, {
            memberid: memberid
        });

    },

    // add an assessment
    addAssessment(assessment) {
        this.store.add(this.collection, assessment);
        this.store.save();
    },

    removeAssessment(id) {
        const assessment = this.getAssessment(id);
        this.store.remove(this.collection, assessment);
        this.store.save();
    }
};

module.exports = assessmentStore;