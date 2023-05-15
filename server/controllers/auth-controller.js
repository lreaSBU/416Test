const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });
        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email,
                userId: loggedInUser._id
            }
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                email: existingUser.email ,
                userId: existingUser._id             
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

requestRecovery = async (req, res) => {
    //do something...
    console.log("requestRecovery");
    try {
        const { email } = req.body;
        console.log("email: " + email);
        if (!email) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter email." });
        }
        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email provided."
                })
        }
        // User was found
        //const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET);
        //console.log("token: " + token);
        //const url = `http://localhost:3000/reset-password/${token}`;
        //console.log("url: " + url);
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'mapCentral1@outlook.com',
                pass: 'Fartyfarts8'
            }
        });
        // Generate a random verification code
        const verificationCode = Math.floor(Math.random() * (999999 - 100000) + 100000);
        console.log("verificationCode: " + verificationCode);
        // Save the verification code to the user
        const expirationTime = Date.now() + (5 * 100000); // 5 * 1000 = 5 secs from now
        existingUser.verificationCode = verificationCode;
        existingUser.expiresAt = new Date(expirationTime);
        await existingUser.save();
        // Send the email
        const mailOptions = {
            from: 'mapCentral1@outlook.com',
            to: email,
            subject: 'Password Reset',
            text: `Your verification code is: ${verificationCode}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send();
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({
                    success: true,
                })
            }
        });





    } catch (err) {
        console.error(err);
        res.status(500).send();
    }


}

verifyCode = async (req, res) => {
    console.log("verifyCode");
    try {
        const { email, code, password } = req.body;
        console.log("email: " + email);
        console.log("code: " + code);
        console.log("password: " + password);
        if (!code || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        // make sure the code entered matches the one in the database and if so, update the password
        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email provided."
                })
        }
        console.log("existingUser.verificationCode: " + existingUser.verificationCode);
        console.log("code: " + code);
        if (existingUser.verificationCode != code) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong verification code provided."
                })
        }
        if(existingUser.expiresAt <= Date.now()){
            return res
                .status(401)
                .json({
                    errorMessage: "Time expired"
                })
        }
        // Verification code matches
        // Hash the new password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        // Save the new password hash to the user
        existingUser.passwordHash = passwordHash;
        await existingUser.save();
        console.log("password updated");
        res.status(200).json({
            success: true,
        })
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        console.log("create user: " + firstName + " " + lastName + " " + email + " " + password + " " + passwordVerify);
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        console.log("password long enough");
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        console.log("password and password verify match");
        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

        // LOGIN THE USER
        const token = auth.signToken(savedUser._id);
        console.log("token:" + token);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,  
                email: savedUser.email,
                userId: savedUser._id
            }
        })

        console.log("token sent");

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    requestRecovery,
    verifyCode
}