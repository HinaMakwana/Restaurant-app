const role = {
    user : 'user',
    admin : 'admin'
}
const orderStatus = {
    pending : "pending",
    confirm : "confirm",
    cancel : "cancel"
}

const validation = {
    User : {
        name: "required|min:3",
        email: "required|email",
        passwrod: [
            "required",
            "regex:/^[a-zA-Z0-9!@#$%^&*]{8,16}$/"
        ],
        confirmPassword: "same:password",
        // role: ["required",{"in": [role.admin,role.user]}],
        mobileNo: "numeric",
        address: "max:150"
    },
    Category : {
        name: "required|min:3",
        addedBy: "required"
    },
    Food : {
        name: "required|min:3",
        category: "required",
        price: "required|integer"
    },
    Favourite: {
        user: "required",
        foodName: "required",
        price: "required|integer"
    },
    Order: {
        user: "required",
        totalAmount: "integer",
        address: "max:140"
    },
    Cart: {
        user: "required",
        food: "required",
        quantity: "integer"
    },
    BookTable: {
        user: "required",
        guestNo: "integer"
    }
}

const otpGenerator = require('otp-generator');

module.exports.common = {
    role,
    orderStatus,
    validation,
    otpGenerator
}