const { isValidObjectId } = require("mongoose");
const yup = require("yup");

const signupSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name can not be empty")
        .test("isPerfectString", "Enter a valid name", (arg) =>
            /^[A-Za-z ]+$/.test(arg)
        ),

    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)
        ),
   
    image: yup
        .string()

});

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)
        ),
    password: yup.string().trim().required("Password can not be empty"),
});


const editSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name can not be empty")
        .test("isPerfectString", "Enter a valid name", (arg) =>
            /^[A-Za-z ]+$/.test(arg)
        ),

    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)
        ),
});

const editPasswordSchema = yup.object().shape({

    pass: yup
        .string()
        .trim()
        .required("Password can not be empty")
        .min(8, "Too short password")
        .max(16, "Too long password")
        .test("isPerfectPasswrod", "Enter a strong password", (arg) =>
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?!.*\s).{8,16})/.test(
                arg
            )
        ),
    newPass: yup
        .string()
        .trim()
        .required("New Password can not be empty")
        .min(8, "Too short password")
        .max(16, "Too long password")
        .test("isPerfectPasswrod", "Enter a strong password", (arg) =>
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?!.*\s).{8,16})/.test(
                arg
            )
        ),

});

const columnSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    order: yup.number().required('Order is required').integer('Order must be an integer'),
  });
  
  // Task Schema
  const taskSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().nullable(),
    dueDate: yup.date().nullable(),
    column: yup.string().required('Column is required').matches(/^[0-9a-fA-F]{24}$/, 'Column must be a valid ObjectId'),
    order: yup.number().required('Order is required').integer('Order must be an integer'),
  });

module.exports.signupSchema = signupSchema;
module.exports.loginSchema = loginSchema;
module.exports.editSchema = editSchema;
module.exports.editPasswordSchema = editPasswordSchema;
module.exports.columnSchema = columnSchema;
module.exports.taskSchema = taskSchema;
