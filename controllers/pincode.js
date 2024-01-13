
const pincodeDirectory = require('india-pincode-lookup');

exports.pincodebycity = async (req, res, next) => {
    try {
        const info= await pincodeDirectory.lookup(req.body.city);
        res.status(200).json({ success: true,
            info});
    } catch (error) {
        res.status(200).send(error);
    }   
  };

  exports.pincodeinfo = async (req, res, next) => {
    try {
  const info = await pincodeDirectory.lookup(req.body.pincode);
        res.status(200).json({ success: true,
            info});
    } catch (error) {
        res.status(200).send(error);
    }   
  };