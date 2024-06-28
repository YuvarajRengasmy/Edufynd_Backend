
exports.basicAuthUser = function (req, res, next) {
    console.log("basicauth verify");
    const credentials = auth(req);
   
    console.log('credentials', credentials);
    if (!credentials || credentials.name !== process.env.basicAuthUser || credentials.pass !== process.env.basicAuthKey) {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).json({
            success: false,
            statusCode: 499,
            message: clientError.token.unauthRoute,
        });
    } else {
        next();
    }
};