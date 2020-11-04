const { param, body, validationResult, sanitize, check } = require('express-validator');

const memberValidationRules = () => {
    return [
        body('status').isIn(['Active', 'InActive']),
        body('joinedDate').isDate(),
        sanitize('joinedDate').toDate(),
    ];
};
const eventValidationRules = () => {
    return [
        body('startDate').isDate(),
        body('endDate').isDate(),
        sanitize('startDate').toDate(),
        sanitize('endDate').toDate(),
        check('startDate').custom((sDate, { req }) => {
            if (sDate >= req.body.endDate) {
                throw new Error('Start date is greater than End date');
            }

            return true;
        })
    ];
};
const attendanceValidationRules = () => {
    return [
        body('timeIn').toDate(),
        body('timeOut').toDate(),
        check('timeIn').custom((sTime, { req }) => {
            console.log(sTime);
            console.log(req.body.timeOut);
            console.log(req.body);

            if (sTime >= req.body.timeOut) {
                throw new Error('Time In is greater than Time Out');
            }

            return true;
        })
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({
        [err.param]: err.msg
    }));

    return res.status(422).json({
        result: 'Validation Error',
        errorMessage: extractedErrors,
        errorStack: ''
    })
};

module.exports = {
    memberValidationRules,
    eventValidationRules,
    attendanceValidationRules,
    validate
};