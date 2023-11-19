const builder = {
    unauthorized: (prefix) => builder.prepare(403, prefix, 'Authentication Error, please try loggin again!'),
    required_field: (prefix) => builder.prepare(401, prefix, 'is a required field!'),
    invalid_request: (prefix) => builder.prepare(400, prefix, 'is not valid!'),
    success: (prefix, obj = {}) => builder.prepare(200, prefix, 'Successfully!', obj),
    error: (prefix) => builder.prepare(501, prefix, 'error!'),
    not_found: (prefix) => builder.prepare(404, prefix, 'not found!'),
    custom: (message) => builder.prepare(400, message, '')
}

Object.defineProperty(builder, 'prepare', {
    writable: false,
    value: (code, prefix, message, obj = {}) => {
        return ({
            code,
            message: `${prefix ? `${prefix} ${message}` : message}`,
            ...obj
        })
    }
})

module.exports = builder;