const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Database = require("../models/database");
const Status = require("../utils/status");
const { User, Role, sequelize, Post, Message} = require("../models/database");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

async function createUser(req, res) {

  try {
    const { lastName, firstName, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(201).json({
        status: Status.USER_ALREADY_EXISTS,
        error: "Cet utilisateur existe déjà",
      });
    }

    // Vérifier le format du mot de passe avec une expression régulière
    const passwordRegex = /^.{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial",
      });
    } else {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);

      // Créer l'utilisateur dans la base de données avec le rôle par défaut
      const user = await User.create({
        id: uuidv4(),
        lastName,
        firstName,
        email,
        password: hash,
        role: "ROLE_USER",
    });

    // Génération du token JWT
    const token = jwt.sign({ userId: user.id }, "arosaje");

    res.status(201).send({
      message: "User created successfully",
      status: Status.CREATE_USER,
      user: {
        lastName: user.lastName,
        firstName: user.firstName,
        token: token,
      },
    });
  }} catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur" });
  }

}

async function updateUser(req, res) {

  const { token, password } = req.body;

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  try {

    const decodedToken = jwt.verify(token, "arosaje")
    const userData = await User.findByPk(decodedToken.userId);
    const id = userData.id

    await User.update({ password: hash }, { where: { id } });
    res.status(200).send({ status: Status.UPDATE_USER });
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
}

async function deleteUser(req, res) {
  const { token } = req.body;

  try {

    const decodedToken = jwt.verify(token, "arosaje")
    const existingUser = await User.findByPk(decodedToken.userId);

    if (!existingUser) {
      return res
        .status(404)
        .send(`The user with id ${existingUser.id} does not exist`);
    }

    // Supprimer tous les posts associés à l'utilisateur
    await Post.destroy({
      where: { UserId: existingUser.id },
    });

    // Supprimer tous les messages associés à l'utilisateur
    await Message.destroy({
      where: { UserId: existingUser.id },
    });

    await User.destroy({
      where: {
        id: existingUser.id,
      },
    });

    res.status(200).send({ status: Status.DELETE_USER });

  } catch (err) {
    res.status(500).send(err);
  }
}

async function deleteUserByAdmin(req, res) {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({
      where: { email: email },
    });

    if (!existingUser) {
      return res
        .status(404)
        .send(`The user with email ${email} does not exist`);
    }

    // Supprimer tous les posts associés à l'utilisateur
    await Post.destroy({
      where: { UserId: existingUser.id },
    });

    // Supprimer tous les messages associés à l'utilisateur
    await Message.destroy({
      where: { UserId: existingUser.id },
    });

    await User.destroy({
      where: {
        email: email,
      },
    });
    res.status(200).send({ status: Status.DELETE_USER });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}




module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  deleteUserByAdmin,
};
