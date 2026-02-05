// routes/accountRoute.js
const express = require("express");
const router = new express.Router();
const regValidate = require("../utilities/account-validation")



const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");


// GET route for "My Account" (login view)
// This route should only be the part AFTER "/account"
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

// Deliver registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt (temporary - for validation testing)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send("login process")
  }
)




module.exports = router;
