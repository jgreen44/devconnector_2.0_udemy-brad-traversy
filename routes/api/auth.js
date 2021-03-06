const express = require('express');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const router = express.Router();


// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.msg);
        res.status(500).send('Server error...')
    }
});

// @route   POST api/auth
// @desc    Authenticate User and get token
// @access  Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {

        // See if user exists, if so, send back an error
        let user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
        }

        // Return JSON Web Token (JWT)
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtToken'), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.json({token})
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }


});

module.exports = router;