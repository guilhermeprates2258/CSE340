const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/* *****************************
 * Classification Validation Rules
 * ***************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters."),
  ]
}

/* *****************************
 * Check Classification Data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* *****************************
 * Inventory Validation Rules
 * ***************************** */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please choose a classification.")
      .isInt({ min: 1 })
      .withMessage("Invalid classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a make.")
      .isLength({ min: 2 })
      .withMessage("Make must be at least 2 characters."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a model.")
      .isLength({ min: 2 })
      .withMessage("Model must be at least 2 characters."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Please provide a year.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be 4 characters.")
      .matches(/^\d{4}$/)
      .withMessage("Year must be numeric (4 digits)."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description.")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Please provide a price.")
      // numeric(9,0) -> sem casas decimais
      .isInt({ min: 0 })
      .withMessage("Price must be a whole number (0 or greater)."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Please provide miles.")
      .isInt({ min: 0 })
      .withMessage("Miles must be an integer (0 or greater)."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color.")
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters."),
  ]
}

/* *****************************
 * Check Inventory Data (sticky)
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory Item",
      nav,
      classificationList,
      // sticky values
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}


module.exports = validate
