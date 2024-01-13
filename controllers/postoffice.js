let { postalData } = require('indian-post')

exports.postofficebypin = async (req, res, next) => {
    try {
        const info =await postalData.getPostData(req.body.pincode);
        var obj=JSON.parse(info)
        res.status(200).json({ success: true,
            obj
        });
    } catch (error) {
        res.status(200).send(error);
    }   
  };