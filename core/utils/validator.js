import validator from 'validator'

const vldtr = {}

vldtr.isEmail = (email) => {
    return validator.isEmail(email)
}

export default vldtr