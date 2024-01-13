const express = require("express");
const {
postofficebypin
} = require("../controllers/postoffice");
const router = express.Router();

router.route("/postofficebypin").post(postofficebypin);


module.exports = router;
 