const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)

  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()

  const className = data?.[0]?.classification_name ?? "Inventory"

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryById(inv_id)

  if (!data) {
    // força 404 se não achar o veículo
    return next({ status: 404, message: "Sorry, that vehicle could not be found." })
  }

  const detailHTML = await utilities.buildInventoryDetailHTML(data)
  let nav = await utilities.getNav()

  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    detailHTML,
  })
}

/* ***************************
 *  Intentional 500 error (Task 3)
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  const err = new Error("Intentional server error (Task 3).")
  err.status = 500
  throw err
}

module.exports = invCont
