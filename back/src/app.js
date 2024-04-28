const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const changePasswordRoutes = require("./routes/changePasswordRoutes");
const postsRoutes = require("./routes/postsRoutes")
const chatRoutes = require("./routes/chatRoutes")
const bodyParser = require("body-parser");



const cors = require("cors");

// Ajoutez ces lignes pour augmenter la limite de taille à 50 Mo (ajustez selon vos besoins)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", userRoutes);
app.use("/", loginRoutes);
app.use("/", changePasswordRoutes);
app.use("/", postsRoutes);
app.use("/", chatRoutes);




const port = 3000;

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port} \nhttp://localhost:${port}/`);
});

