/*
Controller for the home/index page. 
*/

// Code should be executed in strict mode
"use strict";

const logger = require("../utils/logger");

const home = {

    // Controller to render the home page
    index(request, response) {
        logger.info("Rendering home page");

        const viewData = {
            title: "Home Page",
        };
        response.render("index", viewData);
    },
};

// export home
module.exports = home;