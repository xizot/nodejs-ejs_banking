const router = require("express").Router();

router.get("/", (req, res) => {
  return res.render("contact");
});
module.exports = router;
