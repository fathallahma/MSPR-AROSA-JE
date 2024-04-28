const { Sequelize, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const sequelize = new Sequelize("careplanttest", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize.sync();

// Définir les modèles de tables
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  carePlant: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  whoTakeCare: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const PasswordEmailResetCode = sequelize.define("PasswordEmailResetCode", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relations entre les tables
Post.belongsTo(User);
Message.belongsTo(User);
User.hasMany(Post);
User.hasMany(Message);
User.hasMany(PasswordEmailResetCode);

// Créer les tables dans la base de données
sequelize
  .sync()
  .then(async () => {
    console.log("Tables créées avec succès.");
  })
  .catch((error) => {
    console.error("Erreur lors de la création des tables :", error);
  });
module.exports = {
  User,
  Message,
  Post,
  PasswordEmailResetCode,
  sequelize,
};
