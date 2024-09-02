const User = require('../models/userModel');

exports.getAllUsers = async () => {
    return await User.find({});
};
