const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', (req,res) => {
    res.send('Bienvenue sur L\'API de PowerCity')
})

router.get('/user/:user', async (req,res) => {
    const user = await global.db.findOne("user", {username: req.params.user})

    if(user) {
        res.status(200).json({
            username: user.username
        })
    } else {
        res.status(404).json({status: 404, message: "USER_NOT_EXIST"})
    }
})

router.get('/user', async (req,res) => {
    if(req.headers.email || req.headers.password) {
        const user = await global.db.findOne("user", {email: req.headers.email, password: crypto.createHash("sha256").update(req.headers.password).digest("hex")});

        if(!user) return res.status(400).json({status: 400, message: 'NOT_EXIST'})

        if(!user.active) return res.status(400).json({status: 400, message: 'NOT_VALID_EMAIL'});

        res.status(200).json({token: user.token})
    } else if(req.headers.token) {
        const user = await global.db.findOne("user", {token: req.headers.token})

        if(!user) return res.status(400).json({status: 400, message: 'NOT_EXIST'})

        jwt.verify(req.headers.token, process.env.KEY, (err,decoded) => {
            if(err) return res.status(400).json({status: 400, message: 'INVALID_TOKEN'});

            res.status(200).json(decoded);
        })
    }

})

router.post('/user', async (req,res) => {
    const [username, email, password] = [req.body.username, req.body.email, req.body.password];

    if(!username || !email || !password) return res.status(400).json({status: 400, message: "NOT_ENOUGH_ARGUMENTS"})

    const request = (await axios.get('https://api.mojang.com/users/profiles/minecraft/' + username, {
        responseType: "json"
    })).data;

    if(request || await global.db.findOne("user", {username,})) return res.status(400).json({status: 400, message: "USER_ALREADY_EXIST"})

    const token = jwt.sign({
        username: username,
        email: email
    }, process.env.KEY);
    const verify = require('../util/Util').generateString(64)

    await global.db.insert("user", {
        username,
        email,
        password: crypto.createHash("sha256").update(password).digest("hex"),
        active: false,
        token, verify,
    })


    global.mail.sendMail(email, "Vérifier votre compte PowerCity", `
        <h1>Vérifier votre compte</h1>
        <a href='${process.env.HOST}/api/confirm?verify=${verify}'>Cliquer ici pour vérifier votre adresse mail.</a>
    `)

    res.status(200).json({status: 200})
});

router.get('/confirm', async (req,res) => {
    if(!req.query.verify) return res.status(400).json({status: 400, message: 'NOT_VERIFY'});

    const user = await global.db.findOne("user", {verify: req.query.verify});
    if(user.active) return res.redirect(process.env.HOST);

    if(!user) return res.status(400).json({status: 400, message: 'KEY_NOT_CORRECT'});

    global.db.update("user", user, {$set: {active: true}})
    global.db.update("user", user, {$unset: {verify: 1}})

    res.redirect(process.env.HOST);
});

module.exports = router;