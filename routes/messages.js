// api: 
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://user1:user1@ds161346.mlab.com:61346/my_database', ['messages']);

// get all messages
router.get('/messages', function(req, res, next){
    db.messages.find(function(err, messages){
        if(err){
            res.send(err);
        }
        res.json(messages);
    });
});

// get single user
/*
router.get('/users/:id', function(req, res, next){
    db.users.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});
*/

// save message
router.post('/messages', function(req, res, next){
    var message = req.body;
  /*  if(!user.username){
        res.status(400);
        res.json({"error": "No username"});
    } else if (!user.password ){
        res.status(400);
        res.json({"error": "No password"});
    } else if (!user.email){
        res.status(400);
        res.json({"error": "No email"});   
    } else {
        db.users.save(user, function(err, user){
            if(err){
                res.send(err);
            }
            res.json(user);
        });
    }*/

});

// delete user - not used
/*
router.delete('/user/:id', function(req, res, next){
    db.users.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

// update user - not used
router.put('/users/:id', function(req, res, next){
    var user = req.body;
    var updUser = {};
    if(user.title){
        updUser.title = user.title;
    }
    if(!updUser){
        res.status(400);
        res.json({
            "error" : "Bad data"
        });
    }else {
        db.users.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {}, function(err, user){
            if(err){
                res.send(err);
            }
            res.json(user);
        });
    }
});
*/
module.exports = router;