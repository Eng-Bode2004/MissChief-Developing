const express = require('express');
const router = express.Router();
const ImagesControllers = require('../Controllers/ImagesControllers');



                            // Upload User Profile Image //

const chief_frontID = require('../Middlewares/Multer-Chief-FrontID'); // parser
router.post('/chief-frontID', chief_frontID.single('image'), ImagesControllers.uploadPhoto);

const chief_backID = require('../Middlewares/Multer-Chief-BackID'); // parser
router.post('/chief-backID', chief_backID.single('image'), ImagesControllers.uploadPhoto);




module.exports = router;
