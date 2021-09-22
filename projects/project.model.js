const mongoose = require("mongoose");
const Account = require('../accounts/account.model');

// Project Schema
const ProjectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true

        },
        projectVersion: {
            type: String,
            required: true

        },
        projectDate: {
            type: String,
            required: true

        },
        projectDescription: {
            type: String,
            required: true
        },
        projectNotes: {
            type: String,
            required: false
        },
        projectTickets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: false
        }],
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: false
        }]
    },
    {
        timestamps: true

    }
);

ProjectSchema.methods.addUser = (uid) => {
    var _u = this.users || [];
    _u.push(uid);
    this.users = _u;
    this.save()
        .then(Account.findOne({ _id: uid })
            .then(user => {
                user.addProject(this._id);
                user.save();
                return this;
            })
            .catch(err => res.json(err)));

};

module.exports = mongoose.model("Project", ProjectSchema);
