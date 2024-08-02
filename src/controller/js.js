export let updateMaster = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const masterDetails: MasterDocument = req.body;
            const master = await Master.findOne({ $and: [{ _id: { $ne: masterDetails._id }, }, { email: masterDetails.email }, { isDeleted: false }] });
            const company = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const user = await User.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!master && !company && !user) {
                const updateMaster = new Master(masterDetails)
                let insertMaster = await updateMaster.updateOne({
                    $set: {
                        email: masterDetails.email,
                        position: masterDetails.position,
                        location: masterDetails.location,
                        recoveryEmail: masterDetails.recoveryEmail,
                        link: masterDetails.link,
                        image: masterDetails.image,
                        descryption: masterDetails.descryption,
                        backgroundImage: masterDetails.backgroundImage,
                        mobile: masterDetails.mobile,
                        name:masterDetails.name,
                        category:masterDetails.category,
                        sessionCoins:masterDetails.sessionCoins,
                        isPublic:masterDetails.isPublic,
                        primarySkill: masterDetails.primarySkill,
                        secondarySkill: masterDetails.secondarySkill,
                        modifiedOn: masterDetails.modifiedOn,
                        modifiedBy: masterDetails.modifiedBy
                    }, $addToSet: {
                        experience: masterDetails.experience,
                        education: masterDetails.education,
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Master', true, 200, insertMaster, clientError.success.updateSuccess)
            }
            else {
                response(req, res, activity, 'Level-3', 'Update-Master', true, 422, {}, 'Email already registered');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Master', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Master', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};