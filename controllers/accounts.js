/*
 Controller's for member and trainer accounts
 */

// Code should be executed in strict mode
"use strict";

// requirements
const uuid = require("uuid");
const memberStore = require("../models/member-store");
const trainerStore = require("../models/trainer-store");
const logger = require("../utils/logger");


const accounts = {

  // Controller to render the login page
  login(request, response) {
    logger.info("Login Page Rendering");
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },

  /* 
  Controller to redirect to the home page 
  Cookies are all set back to blank 
  */
  logout(request, response) {
    logger.info("Redirecting to home page after logout");
    response.cookie("member", "");
    response.cookie("trainer", "");
    response.redirect("/");
  },

  // Controller to render the signup page
  signup(request, response) {
    logger.info("Signup page rendering");
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  /* 
  Controller to register a new member 
  Member details are taken from the form/request 
  A unique id is created for the member & number of assessments set to 0
  Member is then created and stored in the member-store.json file
  A member cookie is created
  Member is redirected to the member dashboard 
  */
  register(request, response) {
    logger.info("Register member");
    const member = request.body;
    member.id = uuid();
    member.numberOfAssessments = 0;
    memberStore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.cookie("member", member.email);
    response.redirect("/member-dashboard");
  },

  /* 
  Controller for authentication when someone tries to login
  The inputted email address is searched for within the member-store and trainer store
  JSON files, if the email address is in any of these files. The inputted Password
  is checked against the member/trainers password. 
  If there is a match the user is redirected to the dashboard
  If there is no match the user is redirected back to login 
  */
  authenticate(request, response) {
    logger.info("Authentication");
    const member = memberStore.getMemberByEmail(request.body.email);
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    const passwordAttempt = request.body.password;

    /*  
    if the email address belongs to a member or a trainer 
    check that the password entered matches the password stored for the user.
    */
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

  // Method to get the current member using the stored member cookie.
  getCurrentMember(request) {
    logger.debug("Get Current Member");
    const memberEmail = request.cookies.member;
    return memberStore.getMemberByEmail(memberEmail);
  },

  // Method to get the current trainer using the stored trainer cookie
  getCurrentTrainer(request) {
    logger.debug("Get Current Trainer");
    const trainerEmail = request.cookies.trainer;
    return trainerStore.getTrainerByEmail(trainerEmail);
  },

  /* 
  Controller for members profile. When a member is logged in they can 
  view their profile and make changes to their profile
  */
  profile(request, response) {
    logger.info("Render Members Profile Page");
    const memberEmail = request.cookies.member;
    const member = memberStore.getMemberByEmail(memberEmail);
    let male = false;
    if (member.gender == 'male') {
      male = true;
    }
    const viewData = {
      title: "Profile",
      member: member,
      male: male
    }
    response.render("profile", viewData);
  },

  /*
  Controller for trainers profile. When a trainer is logged in they can 
  view their profile and make changes to their profile
  */
  trainerProfile(request, response) {
    logger.info("Render trainers profile page");
    const trainerEmail = request.cookies.trainer;
    const trainer = trainerStore.getTrainerByEmail(trainerEmail);
    let male = true;
    if (trainer.gender == 'male') {
      male = true;
    } else {
      male = false;
    }
    const viewData = {
      title: "Profile",
      trainer: trainer,
      male: male
    }
    response.render("trainerprofile", viewData);
  },

  /* 
  Controller to update a members profile
  new details are taken from the form request
  the member cookie is reset to the email address (incase there was a change in the email address)
  */
  updateMemberProfile(request, response) {
    logger.info("Update members profile");
    const newMemberDetails = request.body;
    const memberEmail = request.cookies.member;
    const member = memberStore.getMemberByEmail(memberEmail);
    memberStore.updateMember(newMemberDetails, member);
    response.cookie("member", member.email);
    logger.info("Member Details Updated");
    response.redirect("/member-dashboard");
  },

  /* 
  Controller to update a trainers profile
  new details are taken from the form request
  the trainer cookie is reset to the email address (incase there was a change in the email address)
  */
  updateTrainerProfile(request, response) {
    logger.info("Update a trainers profile");
    const newTrainerDetails = request.body;
    const trainerEmail = request.cookies.trainer;
    const trainer = trainerStore.getTrainerByEmail(trainerEmail);
    trainerStore.updateTrainer(newTrainerDetails, trainer);
    response.cookie("trainer", trainer.email);
    logger.info("Trainer Details Updated");
    response.redirect("trainer-dashboard");

  }
};

//export accounts
module.exports = accounts;