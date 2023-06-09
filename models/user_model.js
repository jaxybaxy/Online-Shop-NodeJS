
// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')

// require('dotenv').config()
// const DB_URL = process.env.DATABASE_URL

// const User_modelSchema = mongoose.Schema(
//     {
//         username: {
//             type: String,
//             required: true,
//         },
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             trim: true,
//         },
//         password: {
//             type: String,
//             required: true,
//         }
//     });

// const User_model = mongoose.model('user', User_modelSchema);

// exports.get_all_users = async () => {
//     try {
//         await mongoose.connect(DB_URL);

//         const users = await User_model.find({});
//         mongoose.disconnect();
//         return users;
//     } catch (error) {
//         throw error;
//     }
// }

// exports.create_new_user = async (username, email, password) => {
//   try {

//     await mongoose.connect(DB_URL, { connectTimeoutMS: 60000 }); // set timeout to 60 seconds

//     const user = await User_model.findOne({ email: email })
//     if (user) {
//       console.log("email exists");
//       throw new Error("email exists");
//     } else {
//       const hashed_password = await bcrypt.hash(password, 10);
//       const user = new User_model({
//         username: username,
//         email: email,
//         password: hashed_password,
//       });
//       console.log("user created");
//       const options = { maxTimeMS: 30000 }; // 30 seconds timeout

//       return user.save(options);
//     }
//   } catch (error) {
//     throw new Error(`Failed to create a new user: ${error.message}`);
//   } finally { 
//     await mongoose.disconnect();
//   }
// }

// exports.login = async (email, password) => {
//     try {
//         await mongoose.connect(DB_URL);
//         const user = await User_model.findOne({ email: email });
//         if (!user) {
//             console.log("email doesn't exist ");
//             throw new Error("email doesn't exist");
//         } else {
//             const is_same_password = await bcrypt.compare(password, user.password);
//             if (!is_same_password) {
//                 console.log('incorrect password');

//                 throw new Error("incorrect password");
//             } else {
//                 console.log('Login successfully');
//                 return user._id;
//             }
//         }
//     } catch (err) {
//         throw err;
//       } finally { 
//       await  mongoose.disconnect();
//     }
// };



const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

require('dotenv').config()
const DB_URL = process.env.DATABASE_URL

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ' + err))

const User_modelSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User_model = mongoose.model('user', User_modelSchema);

exports.get_all_users = async () => {
    try {
        const users = await User_model.find({});
        return users;
    } catch (error) {
        throw error;
    }
}

exports.create_new_user = async (username, email, password) => {
    try {
        const user = await User_model.findOne({ email: email })
        if (user) {
            console.log("email exists");
            throw new Error("email exists");
        } else {
            const hashed_password = await bcrypt.hash(password, 10);
            const user = new User_model({
                username: username,
                email: email,
                password: hashed_password,
            });
            console.log("user created");
            const options = { maxTimeMS: 30000 }; // 30 seconds timeout
            return user.save(options);
        }
    } catch (error) {
        throw new Error(`Failed to create a new user: ${error.message}`);
    }
}

exports.login = async (email, password) => {
    try {
        const user = await User_model.findOne({ email: email });
        if (!user) {
            console.log("email doesn't exist ");
            throw new Error("email doesn't exist");
        } else {
            const is_same_password = await bcrypt.compare(password, user.password);
            if (!is_same_password) {
                console.log('incorrect password');
                throw new Error("incorrect password");
            } else {
                console.log('Login successfully');
                return user._id;
            }
        }
    } catch (err) {
        throw err;
    }
};
