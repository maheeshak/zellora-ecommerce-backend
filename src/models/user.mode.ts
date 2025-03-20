import mongoose from 'mongoose';
import { Roles, Status } from '../common/enums/enums';


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {  
        phone: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/,
        },
        address: {
            type: String,
            required: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
    roleId: {
        type: String,
    },

    status: {
        type: String,
        enum: Status,
        default: Status.ACTIVE
    },

    avatar: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },

}, { timestamps: true });


const User = mongoose.model('User', userSchema);

export default User;