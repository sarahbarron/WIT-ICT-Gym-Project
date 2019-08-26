/*
Member Model:
A member has an id, first name, last name, email, password, address, start weight and height.
methods are included to
- Add a member to the store
- Remove a member from the store (trainer can only do this)
- Get all members stored in the Json file
- Get a member by its id or email address
- Add and remove number of assessments a member has
- Update a members profile 
*/

// Code should be executed in strict mode
"use strict";

// Requirements
const _ = require("lodash");
const JsonStore = require("./json-store");
const logger = require("../utils/logger");

const memberStore = {

  // Members are stored in the member-store.json file
  store: new JsonStore("./models/member-store.json", {
    members: []
  }),
  collection: "members",

  // Return a list of all members
  getAllMembers() {
    logger.debug("get all members");
    return this.store.findAll(this.collection);
  },

  // Add a member to the Json file
  addMember(member) {
    logger.debug(`add member id: ${member.id}`);
    this.store.add(this.collection, member);
    this.store.save();
  },

  // Use a members id to find the member in the Json file and return it
  getMemberById(id) {
    logger.debug(`get member by id: ${id}`);
    return this.store.findOneBy(this.collection, {
      id: id
    });
  },

  // Use a members email address to find the member in the Json file and return it
  getMemberByEmail(email) {
    logger.debug(`get member by email: ${email}`);
    return this.store.findOneBy(this.collection, {
      email: email
    });
  },

  // When an assessment has been added add 1 to the number of assessments
  addNumberOfAssessments(memberid) {
    logger.debug("Add 1 to number of assessments");
    const member = this.getMemberById(memberid);
    member.numberOfAssessments = parseInt(member.numberOfAssessments) + parseInt(1);
    this.store.save();
  },

  // When an assessment has been deleted subtract 1 from the number of assessments
  subtractNumberOfAssessments(memberid) {
    logger.debug("Subtract 1 from the number of assessments");
    const member = this.getMemberById(memberid);
    if (member.numberOfAssessments > 0) {
      member.numberOfAssessments = parseInt(member.numberOfAssessments) - parseInt(1);
    }
    this.store.save();
  },

  // Update a members Profile with the new inputted details
  updateMember(newMemberDetails, member) {
    logger.debug(`update member id: ${member.id}`);
    if (newMemberDetails.firstName !== "") {
      logger.info(`inside update member if first name: ${newMemberDetails.firstName}`);
      member.firstName = newMemberDetails.firstName;
    }
    if (newMemberDetails.lastName !== "") {
      logger.info(`inside update member if last name: ${newMemberDetails.lastName}`);
      member.lastName = newMemberDetails.lastName;
    }
    if (newMemberDetails.email !== "") {
      member.email = newMemberDetails.email;
    }
    if (newMemberDetails.password !== "") {
      member.password = newMemberDetails.password;
    }
    member.gender = newMemberDetails.gender;
    if (newMemberDetails.address !== "") {
      member.address = newMemberDetails.address;
    }
    if (newMemberDetails.height !== "") {
      member.height = newMemberDetails.height;
    }
    if (newMemberDetails.startweight !== "") {
      member.startweight = newMemberDetails.startweight;
    }
    this.store.save();
  },

  // Delete a member from the json file
  deleteMember(id) {
    logger.debug(`Delete member id: ${id}`);
    const member = this.getMemberById(id);
    this.store.remove(this.collection, member);
    this.store.save();
  }

};

// export memberStore
module.exports = memberStore;