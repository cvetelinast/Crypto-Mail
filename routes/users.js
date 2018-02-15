var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://user1:user1@ds161346.mlab.com:61346/my_database', ['users']);

// get all users
router.get('/users', function (req, res, next) {
    db.users.find(function (err, users) {
        if (err) {
            res.send(err);
        }
        res.json(users);
    });
});

// get single user
router.get('/users/:id', function (req, res, next) {
    db.users.findOne({ _id: mongojs.ObjectId(req.params.id) }, function (err, user) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});

// get single user by email
router.get('/users/username/:username', function (req, res, next) {
    console.log(req.params.username);
    db.users.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});

// get single user by username and password
router.get('/user/:username/:password', function (req, res, next) {
    console.log('get user with username ' + req.params.username + ' and password ' + req.params.password)
    db.users.findOne({ username: req.params.username, password: req.params.password }, function (err, user) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});

// get single user by username or email
router.get('/users/:username/:email', function (req, res, next) {
    db.users.find({ $or: [{ username: req.params.username }, { email: req.params.email }] }, function (err, user) {
        if (err) {
            res.send(err);
        }
        if (user.length == 0) {
            res.json(user);
        } else {
            res.json('Wrong username or email.');
        }
    });
});

// save user
router.post('/users', function (req, res, next) {
    var user = req.body;
    if (!user.username) {
        res.status(400);
        res.json({ 'error': 'No username' });
    } else if (!user.password) {
        res.status(400);
        res.json({ 'error': 'No password' });
    } else if (!user.email) {
        res.status(400);
        res.json({ 'error': 'No email' });
    } else {
        db.users.save(user, function (err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    }
});

// delete user
router.delete('/user/:id', function (req, res, next) {
    db.users.remove({ _id: mongojs.ObjectId(req.params.id) }, function (err, user) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});

// update user
router.put('/users/:id', function (req, res, next) {
    var user = req.body;
    var updUser = {};
    if (user.title) {
        updUser.title = user.title;
    }
    if (!updUser) {
        res.status(400);
        res.json({
            'error': 'Bad data'
        });
    } else {
        db.users.update({ _id: mongojs.ObjectId(req.params.id) }, updTask, {}, function (err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    }
});
module.exports = router;