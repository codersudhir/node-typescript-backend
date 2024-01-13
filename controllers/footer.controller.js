const { Footer } = require("../models")


class Footers {


    // footer

    create = async (req, res, next) => {

        const {
            facebook,
            instagram,
            twitter,
            youtube,
            whatsapp,

            emails,
            phone,
            address,

            copywrite

        } = req.body


        const data = {
            social: {
                facebook,
                instagram,
                twitter,
                youtube,
                whatsapp,
            },
            contact: {
                emails,
                phone,
                address,
            },
            copywrite,

        }

        const jsonData = JSON.stringify(data)

        const token = req.headers.authorization


        if ('token') {
            try {

                var payload = decodeToken(token)
                const newFooter = new Footer({data :jsonData});
                newFooter.userId = payload.id;
                const savedFooter = await newFooter.save();
                res.status(201).json(savedFooter);
                console.log(savedFooter);
                return;
            } catch (err) {
                res.status(500).json(err);
                console.log(err);
                return;
            }
        } else {
            res.status(401).json({ message: "You are not authorized to create a post" });
            return;

        }

        // try {
        //     const jsonData = JSON.stringify(data)

        //     Footer.data = jsonData
        //     await Footer.save()
        //     res.status(200).json('data added successfully')

        // } catch (error) {

        //     res.status(500).json(error)
        //     console.log(error)

        // }




    }


    update = async (req, res, next) => {

        const {
            facebook,
            instagram,
            twitter,
            youtube,
            whatsapp,

            emails,
            phone,
            address,

            copywrite
        } = req.body


        const data = {
            social: {
                facebook,
                instagram,
                twitter,
                youtube,
                whatsapp
            },

            contect: {
                emails,
                phone,
                address,
            },
            copywrite,
        }
            const token = req.header('authorization')
            if(token){

                try {
                    const jsonData = JSON.stringify(data)
                    var payload = decodeToken(token)
                    const footer = await Footer.findOne({
                        userId: payload.id
                    })
                    
                    footer.update({
                        data: jsonData
                    })

                    res.status(200).json('footer updated successfully')
                } catch (error) {
                    res.status(500).json(error)
                    console.log(error)
                    
                }

               

            }else{
                res.status(401).json({ message: "You are not authorized to update" });
                return;
            }
      

    }

    //get footer data
    get = async (req, res, next) => {
        try {
            const data = await Footer.findAll({})
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
            console.log(error)
        }



    }


}

module.exports = new Footers()






