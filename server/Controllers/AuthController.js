const User = require("../Models/UserModel");
const Impact = require("../Models/ImpactModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, username, role, createdAt, howYouHeard } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const impact = await Impact.findOne();

        if (!impact || !impact.howYouHeard || impact.howYouHeard.length <= 0) {
            return res.json({ message: "Impact data not found" });
        }

        switch (howYouHeard) {
            case "GUI Website":
                impact.howYouHeard[0].count += 1;
                await impact.save();
                break;
            case "Giving.sg":
                impact.howYouHeard[1].count += 1;
                await impact.save();
                break;
            case "GUI Facebook":
                impact.howYouHeard[2].count += 1;
                await impact.save();
                break;
            case "GUI Instagram":
                impact.howYouHeard[3].count += 1;
                await impact.save();
                break;
            case "GUI Telegram":
                impact.howYouHeard[4].count += 1;
                await impact.save();
                break;
            case "GUI Electronic Direct Mail (EDM)":
                impact.howYouHeard[5].count += 1;
                await impact.save();
                break;
            case "MFS CS Placement":
                impact.howYouHeard[6].count += 1;
                await impact.save();
                break;
            case "Kins/Friends who experienced GUI":
                impact.howYouHeard[7].count += 1;
                await impact.save();
                break;
            default:
                return res.json({ message: "How you heard about us is required" });
        }

        const user = await User.create({ email, password, username, role, createdAt });

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ 
            message: "User signed in successfully", 
            success: true, 
            user 
        });
        next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password ) {
            return res.json({message:'All fields are required'})
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.json({message:'Incorrect password or email' }) 
        }

        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({message:'Incorrect password or email' }) 
        }

        const token = createSecretToken(user._id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
        });
        res.status(201).json({ 
            message: "User logged in successfully", 
            success: true, 
            user 
        });
        next()
    } catch (error) {
        console.error(error);
    }
  };
