var loopback = require("loopback");
var ACL = loopback.ACL;

module.exports = function (app) {
    var User = app.models.User;
    var Task = app.models.Task;
    User.hasMany(Task, {as: "tasks", foreignKey: "userId"});

    ACL.create({
        accessType: ACL.ALL,
        permission: ACL.ALLOW,
        principalType: ACL.ROLE,
        principalId: "$owner",
        model: "User",
        property: "__get__tasks"
    });
    ACL.create({
        accessType: ACL.ALL,
        permission: ACL.ALLOW,
        principalType: ACL.ROLE,
        principalId: "$owner",
        model: "User",
        property: "__create__tasks"
    });
    ACL.create({
        accessType: ACL.ALL,
        permission: ACL.ALLOW,
        principalType: ACL.ROLE,
        principalId: "$owner",
        model: "User",
        property: "__delete__tasks"
    });
    ACL.create({
        accessType: ACL.ALL,
        permission: ACL.ALLOW,
        principalType: ACL.ROLE,
        principalId: "$owner",
        model: "User",
        property: "__updateById__tasks"
    });
    ACL.create({
        accessType: ACL.ALL,
        permission: ACL.ALLOW,
        principalType: ACL.ROLE,
        principalId: "$owner",
        model: "User",
        property: "__destroyById__tasks"
    });
}
