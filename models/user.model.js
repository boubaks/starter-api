import mongoose from 'mongoose'
import vldtr from '../core/utils/validator'
import crypto from 'crypto'

const User = mongoose.Schema(
    {
        email: {
            type: String,
            validate: {
                validator: vldtr.isEmail,
                message: 'error:userSchema: Invalid email'
            },
            unique: true,
            required: true
        },
        username: {
            type: String
        },
        admin: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            default: 'en'
        },
        hashedPassword: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        tokenPassword: {
            type: String
        },
        tokenValidation: {
            type: Date
        },
        created: {
            type: Date,
            default: Date.now
        },
        updated: {
            type: Date,
            value: Date.now
        }
    },
    {
        collection: 'users'
    }
)

User.methods.encryptPassword = function(password) {
    return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    // more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString('hex')
}

User.virtual('password')
    .set(function(password) {
        this._plainPassword = password
        this.salt = crypto.randomBytes(32).toString('hex')
        // more secure - this.salt = crypto.randomBytes(128).toString('hex')
        if (password) {
            this.hashedPassword = this.encryptPassword(password)
        }
    })
    .get(function() {
        return this._plainPassword
    })

User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword
}

const UserModel = mongoose.model('User', User)

/*
 ** MODELS METHODS
 */
UserModel.getAll = (query, pagination) => {
    return UserModel.find({})
        .select('-hashedPassword -salt')
        .skip(pagination.skip)
        .limit(pagination.limit)
}

UserModel.get = email => {
    return UserModel.findOne({ email: email })
}

UserModel.getByToken = token => {
    return UserModel.findOne({ tokenPassword: token })
}

UserModel.getUser = id => {
    return UserModel.findOne({ _id: id })
}

UserModel.addUser = userToAdd => {
    return userToAdd.save()
}

UserModel.updatePassword = (id, newPassword) => {
    const opts = { runValidators: true }
    const salt = crypto.randomBytes(32).toString('hex')

    const userUpdate = {
        salt: salt,
        hashedPassword: crypto
            .createHmac('sha1', salt)
            .update(newPassword)
            .digest('hex'),
        tokenPassword: null,
        updated: new Date()
    }
    return UserModel.update({ _id: id }, { $set: userUpdate }, opts)
}

UserModel.updateUser = (id, userUpdate) => {
    const opts = { runValidators: true }
    return UserModel.update({ _id: id }, { $set: userUpdate }, opts)
}

UserModel.removeUser = id => {
    return UserModel.remove({ _id: id })
}

export default UserModel
