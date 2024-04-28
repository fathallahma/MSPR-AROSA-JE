const Status = require("../utils/status");
const { Message, User, sequelize } = require("../models/database");
const jwt = require("jsonwebtoken");

sequelize.sync().then(() => {
  console.log("Models synchronized with database in chatController");
});

async function getAllMessages(req, res) {
  try {
    const rows = await Message.findAll({
      order: [["createdAt", "DESC"]],
      include: {
        model: User,
        attributes: ["firstName", "lastName"],
      },
    });
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}


async function saveMessage(req, res) {
  const { text, token } = req.body;

  try {
    const decodedToken = jwt.verify(token, "arosaje")
    const userData = await User.findByPk(decodedToken.userId);

    // Enregistrement du message avec l'id de l'utilisateur connecté
    const createdMessage = await Message.create({ text: text, UserId: userData.id });

    if (!userData) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Renvoyer le message avec le nom et prénom de l'utilisateur
    const messageWithUser = {
      id: createdMessage.id,
      text: createdMessage.text,
      createdAt: createdMessage.createdAt,
      user: { id: userData.id, firstName: userData.firstName, lastName: userData.lastName },
    };

    res.status(201).json(messageWithUser);
  } catch (error) {
    console.error('Error verifying JWT:', error);
    res.status(401).json({ message: "Token JWT invalide", status: Status.INVALID_TOKEN });
  }
}

async function deleteMessageByAdmin(req, res) {
  const { text } = req.body;

  try {
    await Message.destroy({
      where: { text: text },
    });

    res.status(200).send({status: Status.DELETE_MESSAGE});

  } catch (error) {
    console.error('Error during deleting of this message', error);
  }
}

module.exports = {
  getAllMessages,
  saveMessage,
  deleteMessageByAdmin,
};
