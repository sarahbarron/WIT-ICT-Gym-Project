/*
Controller for the about the gym app page
*/

// Code should be executed in strict mode
"use strict";

// requirements
const logger = require("../utils/logger");

const about = {
  // Controller to render the about.hbs page
  index(request, response) {
    logger.info("about rendering");
    const viewData = {
      title: "About Gym App",
    };
    response.render("about", viewData);
  }
};

// export about 
module.exports = about;