const banks = require("../models/banks")


exports.findbankslistbypin = async (req, res, next) => {
  const Banks = await banks.find({ "ADDRESS" : { $regex: req.body.pincode, $options: 'i' } })


//const addallbanks =await banks.insertMany(banksdataifsc.RTGS2)
//console.log(addallbanks.length);
  res
    .status(200)
    .json({ success: true,
        "No of banks":Banks.length,
         Banks});
};
exports.findbankbypinandbankname = async (req, res, next) => {
   
    const Bank = await banks.find({ "ADDRESS" : { $regex: req.body.pincode, $options: 'i' },"BANK":req.body.bankname })
    res
      .status(200)
      .json({ success: true, Bank});
  };
  exports.findbankbycityname = async (req, res, next) => {
    const Bank = await banks.find({$and: [
      { $or: [{"CITY1" : { $regex: req.body.city, $options: 'i' }}, {"CITY2":{ $regex: req.body.city, $options: 'i' }}] },
     // { $or: [{c: 1}, {d: 1}] }
  ] })
   
    res
      .status(200)
      .json({ success: true, Bank});
  };
  exports.findbankbycitynameandbankname = async (req, res, next) => {
    const Bank = await banks.find({$and: [
      { $or: [{"CITY1" : { $regex: req.body.city, $options: 'i' }}, {"CITY2":{ $regex: req.body.city, $options: 'i' }}] },
      { $or: [{"BANK":req.body.bankname}] }
  ] })
  res
      .status(200)
      .json({ success: true, Bank});
  };
