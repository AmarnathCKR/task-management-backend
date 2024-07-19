const User = require("../../Database/userSchema");


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { emailSender } = require("../../helper/emailSender");



const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_KET_JWT);
};


const signup = async (req, res) => {

    try {

        const { name, email, image, password, google } = req.body;
        console.log(req.body)
        if (google === true) {
            if (email) {
                const user = await User.findOne({ email });
                if (user) {
                    const stat = {
                        status: false,
                        errors: [
                            {
                                param: "email",
                                message: "User Already Exist",
                                code: "INVALID_INPUT",
                            },
                        ],
                    };
                    res.status(409).send({ data: stat });
                } else {
                    const newUser = new User({
                        name: name,
                        email: email,
                        image: image,
                        google: true,
                        status: true,
                    });

                    await newUser.save();

                    const users = await User.findOne({ email });
                    const token = await createToken(users._id);


                    const success = {
                        status: true,
                        content: {
                            data: {
                                id: users._id,
                                name: users.name,
                                email: users.email,
                                image: users.image,
                                created_at: users.createdAt,
                            },
                            meta: {
                                access_token: token,
                            },
                        },
                    };
                    res.status(200).send({ data: success });
                }
            } else {
                const stat = {
                    status: false,
                    errors: [
                        {
                            param: "googleAuth",
                            message: "No data received",
                            code: "INVALID_INPUT",
                        },
                    ],
                };
                res.status(409).send({ data: stat });
            }
        } else {
            if (name.length <= 6) {
                const stat = {
                    status: false,
                    errors: [
                        {
                            param: "name",
                            message: "Name should be at least 6 characters.",
                            code: "INVALID_INPUT",
                        },
                    ],
                };
                res.status(409).send({ data: stat });
            } else {
                const member = await User.findOne({ email });
                if (member) {
                    const exist = {
                        status: false,
                        errors: [
                            {
                                param: "name",
                                message: "Email already exist",
                                code: "INVALID_INPUT",
                            },
                        ],
                    };
                    res.status(409).send({ data: exist });
                } else {
                    const match = email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
                    if (match) {
                        if (password.length < 7) {
                            const passError = {
                                status: false,
                                errors: [
                                    {
                                        param: "password",
                                        message: "password should be min 6",
                                        code: "INVALID_INPUT",
                                    },
                                ],
                            };
                            res.status(409).send({ data: passError });
                        } else {
                            const hashPassword = await bcrypt.hash(password, 10);

                            const newUser = new User({
                                name: name,
                                email: email,
                                image: image,
                                google: false,
                                status: true,
                                password: hashPassword
                            });

                            await newUser.save();

                            const users = await User.findOne({ email });
                            const token = await createToken(users._id);


                            const success = {
                                status: true,
                                content: {
                                    data: {
                                        id: users._id,
                                        name: users.name,
                                        email: users.email,
                                        image: users.image,
                                        created_at: users.createdAt,
                                    },
                                    meta: {
                                        access_token: token,
                                    },
                                },
                            };

                            return res.status(200).send({ data: success });


                        }
                    } else {
                        const emailError = {
                            status: false,
                            errors: [
                                {
                                    param: "email",
                                    message: "Please enter correct Email",
                                    code: "INVALID_INPUT",
                                },
                            ],
                        };
                        res.status(409).send({ data: emailError });
                    }
                }
            }
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Server error" });
    }
}

const login = async (req, res) => {
    const { email, password, google } = req.body;
    if (req.body) {
        if (google) {
            const users = await User.findOne({ email });
            if (users) {
                if (!users.status) {
                    const emailError = {
                        status: false,
                        errors: [
                            {
                                param: "Blocked",
                                message: "Your Account is blocked",
                                code: "USER_BLOCKED",
                            },
                        ],
                    };
                    res.status(409).send({ data: emailError });
                } else {
                    const token = await createToken(users._id);

                    const success = {
                        status: true,
                        content: {
                            data: users,
                            meta: {
                                access_token: token,
                            },
                        },
                    };
                    res.status(200).send({ data: success });
                }
            } else {
                const emailError = {
                    status: false,
                    errors: [
                        {
                            param: "email",
                            message: "no user found",
                            code: "INVALID_INPUT",
                        },
                    ],
                };
                res.status(409).send({ data: emailError });
            }
        } else {
            const users = await User.findOne({ email });
            if (users) {
                if (users.google === true) {
                    const emailError = {
                        status: false,
                        errors: [
                            {
                                param: "email",
                                message: "Please login using google Account",
                                code: "INVALID_INPUT",
                            },
                        ],
                    };
                    res.status(409).send({ data: emailError });
                } else {
                    const match = await bcrypt.compare(password, users.password);
                    if (match) {
                        if (!users.status) {
                            const emailError = {
                                status: false,
                                errors: [
                                    {
                                        param: "Blocked",
                                        message: "Your Account is blocked",
                                        code: "USER_BLOCKED",
                                    },
                                ],
                            };
                            res.status(409).send({ data: emailError });
                        } else {
                            const token = await createToken(users._id);

                            const success = {
                                status: true,
                                content: {
                                    data: users,
                                    meta: {
                                        access_token: token,
                                    },
                                },
                            };
                            res.status(200).send({ data: success });
                        }
                    } else {
                        const emailError = {
                            status: false,
                            errors: [
                                {
                                    param: "password",
                                    message: "incorrect password",
                                    code: "INVALID_INPUT",
                                },
                            ],
                        };
                        res.status(409).send({ data: emailError });
                    }
                }
            } else {
                const emailError = {
                    status: false,
                    errors: [
                        {
                            param: "email",
                            message: "no user found",
                            code: "INVALID_INPUT",
                        },
                    ],
                };
                res.status(409).send({ data: emailError });
            }
        }
    } else {
        const emailError = {
            status: false,
            errors: [
                {
                    param: "email",
                    message: "No inputs received",
                    code: "INVALID_INPUT",
                },
            ],
        };
        res.status(409).send({ data: emailError });
    }
};


const fetchUser = async (req, res) => {
    const { id } = req.params;
    const userValid = await User.findOne({ _id: id });
    if (userValid.status) {
        const user = {
            id: userValid._id,
            email: userValid.email,
            name: userValid.name
        }
        res.status(200).json({ user })
    } else {
        res.status(404).send({ error: "user blocked" });
    }

}

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const userValid = await User.findOne({ _id: id });
        if (userValid.status) {
            const newUser = await User.findByIdAndUpdate(id, { name, email });
            const user = {
                id: newUser._id,
                email,
                name
            }
            res.status(200).json({ user })
        } else {
            res.status(404).send({ error: "user blocked" });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Server error" });
    }

}

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { pass, newPass } = req.body;
        const userValid = await User.findOne({ _id: id });
        if (userValid.status) {
            const match = await bcrypt.compare(pass, userValid.password);
            if (match) {
                if (pass === newPass) return res.status(404).send({ message: "New password same as current password" });
                const hashPassword = await bcrypt.hash(newPass, 10);
                const newUser = await User.findByIdAndUpdate(id, { password: hashPassword });
                const user = {
                    id: newUser._id,
                    email: newUser.email,
                    name: newUser.name
                }
                res.status(200).json({ user })
            } else {
                res.status(404).send({ message: "Invalid Current Password" });
            }

        } else {
            res.status(404).send({ message: "user blocked" });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Server error" });
    }

}



module.exports.signup = signup;
module.exports.login = login;
module.exports.changePassword = changePassword;
module.exports.editUser = editUser;
module.exports.fetchUser = fetchUser;
