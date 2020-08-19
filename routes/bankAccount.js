const express = require("express");
const router = express.Router();
const accountInfo = require("../services/accountInfo");
var cards = [];
router.get("/", async (req, res) => {
  if (!req.currentUser) return res.redirect("/login");
  if (
    req.currentUser &&
    !req.currentUser.email &&
    req.currentUser.permisstion == 0
  )
    return res.redirect("/add-mail");

  if (
    req.currentUser &&
    req.currentUser.token &&
    req.currentUser.permisstion == 0
  )
    return res.redirect("/active");

  cards = await accountInfo.findAll({
    where: {
      userID: req.currentUser.id,
    },
  });
  return res.render("bankAccount", { cards: cards });
});

module.exports = router;
