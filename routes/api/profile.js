const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const normalize = require('normalize-url')
const {check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'})
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {
            website,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body;


        // Build profile object
        const profileFields = {
            user: req.user.id,
            website: website && website !== '' ? normalize(website, {forceHttps: true}) : '',
            skills: Array.isArray(skills) ? skills : skills.split(',').map((skills) => skills.trim()),
            ...rest
        };

        // Build socialFields object
        const socialFields = {youtube, twitter, instagram, linkedin, facebook};

        // Normalize social fields to ensure valid url
        for (const [key, value] of Object.entries(socialFields)) {
            if (value && value.length > 0) {
                socialFields[key] = normalize(value, {forceHttps: true});
            }
        }

        // Add to profileFields
        profileFields.social = socialFields;

        try {
            // Using upsert option (creates new doc if no match is found)
            let profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true, upsert: true, setDefaultsOnInsert: true}
            );
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

module.exports = router;