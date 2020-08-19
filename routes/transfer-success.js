const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.currentUser) return res.redirect("/login");
  if (req.currentUser && req.currentUser.isActive == 5)
    return res.redirect("/alert/blocked");

  return res.render("transfer-success");
});

module.exports = router;
