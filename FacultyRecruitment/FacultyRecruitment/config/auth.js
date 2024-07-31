function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", 'Please log in first');
    res.redirect("/users/signin");
}

function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("error_msg", 'Your are now Logged In');
    res.redirect("/users/signin");
}
module.exports = { iLog: isLoggedIn, iNLog: isNotLoggedIn };