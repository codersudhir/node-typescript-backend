
var nodemailer = require('nodemailer');
const { OTP,User} = require('../models');
const jwt = require('jsonwebtoken');
class EmailController {
    sendEmail = async (req, res, next) => {
console.log(req.body);

        var transporter = nodemailer.createTransport({
            // service: 'cruxtech.in',
            host:'webmail.itaxeasy.com',
            port:465,
            // secure:false,
            auth: {
              user: 'support@itaxeasy.com',
              pass: process.env.EMAIL_PASSWORD
            },
            tls: {
              // do not fail on invalid certs
              rejectUnauthorized: false
          },
          });
          var mailOptions = {
            from: 'support@itaxeasy.com',
            to: req.body.email,
            // to: "vineetkaimau@gmail.com",
            subject: req.body.subject,
            text: req.body.text
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500).json({
                    status: "error",
                    message: "email not sent",
                    error:error
                })
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).json({
                status: "success",
                message: "email sent",
                info:info
            })
            }
          });
    }
    // SEND OTP TO EMAIL FOR VERIFICATION, PASSWORD RESET, ETC
    sendOtpEmail = async (req, res, next) => {
   try {
    const {email,type} = req.body;
    let email_subject, email_message;
    if(!email){
      const response={"status":"Failure","message":"Email not provided"}
      return res.status(400).send(response) 
    }
    if(!type){
      const response={"status":"Failure","message":"Type not provided"}
      return res.status(400).send(response) 
    }
    const user= await User.findOne({
      where: {
          email: email
      }
  });
    if(!user){
      const response={"status":"Failure","message":"Email not exist"}
      return res.status(400).send(response)
    }
     //Generate OTP 
  const otp = Math.floor(Math.random()*899999+100000).toString();
  const now = new Date();
  const expiration_time = AddMinutesToDate(now,10);
   //Create OTP instance in DB
  const otp_instance = await OTP.create({
    otp: otp,
    expiration_time: expiration_time
  });
   // Create details object containing the email and otp id
   var details={
    "timestamp": now, 
    "check": email,
    "success": true,
    "message":"OTP sent to user",
    "otp_id": otp_instance.id
  }
      // Encrypt the details object
      // const encoded= await encode(JSON.stringify(details));

      if(type){
        if(type=="VERIFICATION"){
          
          email_message=`Dear User, \n\n` 
          + 'OTP for your email verification is : \n\n'
          + `${otp}\n\n`
          + 'This is a auto-generated email. Please do not reply to this email.\n\n'
          + 'Regards\n'
          + 'Itaxeasy\n\n'
          email_subject="OTP: For Email Verification"
        }
        else if(type=="FORGET"){
     
          email_message=`Dear User, \n\n` 
          + 'OTP for Reset Password is : \n\n'
          + `${otp}\n\n`
          + 'This is a auto-generated email. Please do not reply to this email.\n\n'
          + 'Regards\n'
          + 'Itaxeasy \n\n'
          email_subject="OTP: For Reset Password"
        }
        else if(type=="2FA"){
     
          email_message= `Dear User,\n`
          + `${otp} is your otp for Login.Please Enter the OTP to proceed.\n`
          + `Regards\n`
          + `Itaxeasy\n\n`
          email_subject="OTP: For Reset Password"
        }
        else{
          const response={"Status":"Failure","Details":"Incorrect Type Provided"}
          return res.status(400).send(response) 
        }
        
      }
      var transporter = nodemailer.createTransport({
        // service: 'cruxtech.in',
        host:'webmail.itaxeasy.com',
        port:465,
        // secure:false,
        auth: {
          user: 'support@itaxeasy.com',
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
      },
      });
      const mailOptions = {
        from: `support@itaxeasy.com`,
        to: `${email}`,
        subject: email_subject,
        text: email_message ,
      };
      await transporter.verify();
        //Send Email
  await transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
        return res.status(400).send({"status":"Failure","message": err });
    } else {
      return res.send({"status":"Success","data": details});
    }
  });

   } catch (err) {
    const response={"status":"Failure","message": err.message}
    return res.status(400).send(response)
   }

    }

    verifyEmail = async (req, res, next) => {
      try {
        var currentdate = new Date(); 
        const {verification_key, otp, email} = req.body;
       
    if(!verification_key){
      const response={"status":"Failure","message":"Verification Key not provided"}
      return res.status(400).send(response) 
    }
    if(!otp){
      const response={"status":"Failure","message":"OTP not Provided"}
      return res.status(400).send(response) 
    }
    if(!email){
      const response={"status":"Failure","message":"Check not Provided"}
      return res.status(400).send(response) 
    }
    // Find the OTP instance in DB
    const otp_instance = await OTP.findOne({
      where: {
        id: verification_key

      }
    });
    if(otp_instance!=null){
      // Check if the OTP is expired
      if(otp_instance.expiration_time<currentdate){
        const response={"status":"Failure","message":"OTP Expired"}
        return res.status(400).send(response) 
      }
      // Check if the OTP is correct
      if(otp_instance.otp!=otp){
        const response={"status":"Failure","message":"Incorrect OTP"}
        return res.status(400).send(response) 
      }
      // Check if the email is correct
    
      // Delete the OTP instance from DB
      await OTP.destroy({
        where: {
          id: verification_key
        }
      });
      // Update the user's email_verified field to true
      await User.update({
        isverified: true
      },{
        where: {
          email: email
        }
      });

      const response={"status":"Success","message":"Email Verified"}
      return res.status(200).send(response) 
    }else{
      const response={"status":"Failure","message":"Incorrect Verification Key"}
      return res.status(400).send(response) 
    }
       
      } catch (err) {
        const response={"status":"Failure","message": err.message}
        return res.status(400).send(response)
      }
    }
    veriForgotPassword = async (req, res, next) => {
      try {
        var currentdate = new Date(); 
        const {verification_key, otp, email} = req.body;

    if(!verification_key){
      const response={"status":"Failure","message":"Verification Key not provided"}
      return res.status(400).send(response) 
    }
    if(!otp){
      const response={"status":"Failure","message":"OTP not Provided"}
      return res.status(400).send(response) 
    }
    if(!email){
      const response={"status":"Failure","message":"Email not Provided"}
      return res.status(400).send(response) 
    }
    // Find the OTP instance in DB
    const otp_instance = await OTP.findOne({
      where: {
        id: verification_key
      }
    });
    if(otp_instance!=null){
      // Check if the OTP is expired
      if(otp_instance.expiration_time<currentdate){
        const response={"status":"Failure","message":"OTP Expired"}
        return res.status(400).send(response) 
      }
      // Check if the OTP is correct
      if(otp_instance.otp!=otp){
        const response={"status":"Failure","message":"Incorrect OTP"}
        return res.status(400).send(response) 
      }
      // Check if the email is correct

    
      // Delete the OTP instance from DB
      await OTP.destroy({
        where: {
          id: verification_key
        }
      });
      //find user in db
      const user = await User.findOne({
        where: {
          email: email
        } 
      });
      if(user!=null){
        const now = new Date();
        const expiration_time = AddMinutesToDate(now,10);
      const token= jwt.sign({
          id: user['dataValues']['id'],
          email: user['dataValues']['email'],
          expiration_time: expiration_time,
          environment: process.env.NODE_ENV
      }, process.env.JWT_KEY, {
          issuer: "iTaxEasy",
          expiresIn: "1Y"
      });
      return res.status(200).json({
        status: "Success",
        message: "OTP Verified",
        token: token
      });
        
      }else{
        const response={"status":"Failure","message":"User not found"}
        return res.status(400).send(response)
      }
    }else{
      const response={"status":"Failure","message":"Incorrect Verification Key"}
      return res.status(400).send(response) 
    }
  }catch (err) {
    const response={"status":"Failure","message": err.message}
    return res.status(400).send(response)
  }
     

}
}
// To add minutes to the current time
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}
      

module.exports = new EmailController();