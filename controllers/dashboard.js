"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");


const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInmember = accounts.getCurrentMember(request);
    const viewData = {
      title: "Gym App Dashboard",
      
    };
   
    response.render("dashboard", viewData);
  },


};

module.exports = dashboard;
