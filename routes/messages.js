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

// get single user's received messages
// :id is the id of user in table 'users'

router.get('/messages/:id', function(req, res, next){
    db.messages.find({toId: req.params.id}, function(err, messages){
        if(err){
            res.send(err);
        }
        res.json(messages);
    });
});


// save message

router.post('/messages', function(req, res, next){
    let message = req.body;
    if(!message.from || !message.fromEmail){
        res.status(400);
        res.json({"error": "No information from who."});
    } else if(!message.to || !message.toEmail || !message.toId){
        res.status(400);
        res.json({"error": "No information to who."});
    } else {
        db.messages.save(message, function(err, message){
            if(err){
                res.send(err);
            }
            // encrypt message.message and send it
            res.json(message);
        });
    }
});

// delete message - not used

router.delete('/messages/:id', function(req, res, next){
    db.messages.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, message){
        if(err){
            res.send(err);
        }
        res.json(message);
    });
});

// update message - not used

router.put('/messages/:id', function(req, res, next){
    var message = req.body;
    var updMessage = {};
    if(user.title){
        updUser.title = user.title;
    }
    if(!message.from || !message.fromEmail){
        res.status(400);
        res.json({"error": "No information from who."});
    } else if(!message.to || !message.toEmail || !message.toId){
        res.status(400);
        res.json({"error": "No information to who."});
    } else {
        db.messages.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {}, function(err, message){
            if(err){
                res.send(err);
            }
            res.json(message);
        });
    }
});

module.exports = router;