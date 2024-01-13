const express = require("express");
const {
    pincodebycity,
    pincodeinfo
} = require("../controllers/pincode");
const router = express.Router();

router.route("/pincodebycity").post(pincodebycity);
router.route("/pincodeinfo").post(pincodeinfo);


module.exports = router;
 