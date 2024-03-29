"use strict";

/** Routes for Lunchly */

const express = require("express");

const Customer = require("./models/customer");
const Reservation = require("./models/reservation");

const router = new express.Router();


router.get('/customers', async function (req, res, next) {

    const name = req.query.search;
    const customers = await Customer.search(name);
    return res.render('customer_list.html', {customers}  )
});

router.get('/best', async function (req, res, next) {
  
    const customers = await Customer.bestCustomers();
    

    return res.render('customer_list.html', {customers}  )
});


/** Homepage: show list of customers. */

router.get("/", async function (req, res, next) {
  const customers = await Customer.all();
  return res.render("customer_list.html", { customers });
});

/** Form to add a new customer. */

router.get("/add/", async function (req, res, next) {
  return res.render("customer_new_form.html");
});

/** Handle adding a new customer. */

router.post("/add/", async function (req, res, next) {
  const { firstName, lastName, phone, notes } = req.body;
  const customer = new Customer({ firstName, lastName, phone, notes });
  await customer.save();

  return res.redirect(`/${customer.id}/`);
});

/** Show a customer, given their ID. */

router.get("/:id/", async function (req, res, next) {
  const customer = await Customer.get(req.params.id);

  const reservations = await customer.getReservations();
  console.log(reservations[0].customerId)

  return res.render("customer_detail.html", { customer, reservations });
});

/** Show form to edit a customer. */

router.get("/:id/edit/", async function (req, res, next) {
  const customer = await Customer.get(req.params.id);

  res.render("customer_edit_form.html", { customer });
});

/** Handle editing a customer. */

router.post("/:id/edit/", async function (req, res, next) {
  const customer = await Customer.get(req.params.id);
  customer.firstName = req.body.firstName;
  customer.lastName = req.body.lastName;
  customer.phone = req.body.phone;
  customer.notes = req.body.notes;
  await customer.save();

  return res.redirect(`/${customer.id}/`);
});

/** Handle adding a new reservation. */
// TODO: check for existing user, if not add new user
router.post("/:id/add-reservation/", async function (req, res, next) {
  const customerId = req.params.id;
  const startAt = new Date(req.body.startAt);
  const numGuests = req.body.numGuests;
  const notes = req.body.notes;
  console.log(startAt)
  const reservation = new Reservation({
    customerId,
    startAt,
    numGuests,
    notes,
  });
  await reservation.save();

  return res.redirect(`/${customerId}/`);
});

/**show form to edit a reservation */
router.get("/reservation/:id/edit/", async function (req, res, next) {
    const reservation = await Reservation.get(req.params.id);
    console.log(reservation.customerId)
    res.render("reservation_edit.html", { reservation });
  });
  
  /** Handle editing a customer. */
  
  router.post("/reservation/:id/edit/", async function (req, res, next) {
    
    const reservation = await Reservation.get(req.params.id);
    reservation.customerId = reservation.customerId
    reservation.numGuests = req.body.numGuests;
    reservation.startAt = req.body.startAt;
    reservation.notes = req.body.notes;
  
    await reservation.save();
  
    return res.redirect(`/${reservation.customerId}/`);
  });
  




module.exports = router;
