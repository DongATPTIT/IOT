const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userService = require('../service/user.service');


const  userController = (db) => {

    router.get('/users', async function getUser(req, res) {
       const user = await userService.getListUser();
       console.log(user);

       res.send({
        status:200
       });

    });

    return router;
}

module.exports = userController;
