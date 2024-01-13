const express = require("express");
const {findbankslistbypin,findbankbypinandbankname,findbankbycityname,findbankbycitynameandbankname} = require("../controllers/banks");
const router = express.Router();

router.route("/banklistbypin").post(findbankslistbypin);
router.route("/bankbypinandname").post(findbankbypinandbankname);
router.route("/bankbycitynameandbankname").post(findbankbycitynameandbankname);
router.route("/bankbycityname").post(findbankbycityname);


module.exports = router;
 