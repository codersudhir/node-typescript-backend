const express = require('express')
const router = express.Router()
const footer = require("../controllers/footer.controller")

router.post('/create',footer.create)
router.put('/update',footer.update)
router.get('/getFooterData',footer.get)






module.exports = router