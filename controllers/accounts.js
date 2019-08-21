"use strict";

const memberStore = require("../models/member-store");
const trainerStore = require("../models/trainer-store");
const logger = require("../utils/logger");
const uuid = require("uuid");


const accounts = {

  login(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("member", "");
    response.cookie("trainer", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid();
    member.numberOfAssessments = 0;
    memberStore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.cookie("member", member.email);
    response.redirect("/member-dashboard");
  },

  authenticate(request, response) {
    const member = memberStore.getMemberByEmail(request.body.email);
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    const passwordAttempt = request.body.password;

    //  if the email address is belonging to a member or a trainer 
    //  check that the password entered matches the password stored for the user.
    if (member || trainer) {
      if (member) {
        let memberPassword = member.password;
        if (memberPassword === passwordAttempt) {
          response.cookie("member", member.email);
          logger.info(`logging in ${member.email}`);
          response.redirect("/member-dashboard");
        } else {
          // if the passwords do not match return to the login page
          response.redirect("/login");
        }
      } else if (trainer) {
        let trainerPassword = trainer.password;
        if (trainerPassword === passwordAttempt) {
          response.cookie("trainer", trainer.email);
          logger.info(`logging in ${trainer.email}`);
          response.redirect("/trainer-dashboard");
        } else {
          // if the passwords do not match return to the login page
          response.redirect("/login");
        }
      }
    }
    //  if the person trying to login email address is not stored return to the login page
    else {
      response.redirect("/login");
    }
  },

  getCurrentMember(request) {
    const memberEmail = request.cookies.member;
    return memberStore.getMemberByEmail(memberEmail);
  },

  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return trainerStore.getTrainerByEmail(trainerEmail);
  },

  profile(request, response) {
    const memberEmail = request.cookies.member;
    const member = memberStore.getMemberByEmail(memberEmail);
    let male = true;
    if (member.gender == 'male') {
      male = true;
    } else {
      male = false;
    }
    const viewData = {
      member: member,
      male: male
    }
    response.render("profile", viewData);
  },

  trainerProfile(request, response) {
    const trainerEmail = request.cookies.trainer;
    const trainer = trainerStore.getTrainerByEmail(trainerEmail);
    let male = true;
    if (trainer.gender == 'male') {
      male = true;
    } else {
      male = false;
    }
    const viewData = {
      trainer: trainer,
      male: male
    }
    response.render("trainerprofile", viewData);
  },

  updateMemberProfile(request, response) {
    const newMemberDetails = request.body;
    const memberEmail = request.cookies.member;
    const member = memberStore.getMemberByEmail(memberEmail);
    memberStore.updateMember(newMemberDetails, member);
    response.cookie("member", member.email);
    logger.info("Member Details Updated");
    response.redirect("/member-dashboard");
  },

  updateTrainerProfile(request, response) {
    const newTrainerDetails = request.body;
    const trainerEmail = request.cookies.trainer;
    const trainer = trainerStore.getTrainerByEmail(trainerEmail);
    trainerStore.updateTrainer(newTrainerDetails, trainer);
    response.cookie("trainer", trainer.email);
    logger.info("Trainer Details Updated");
    response.redirect("trainer-dashboard");

  }
};

module.exports = accounts;