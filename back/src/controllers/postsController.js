const { Post, sequelize } = require('../models/database');
const path = require('path');
const jwt = require("jsonwebtoken");
const Status = require("../utils/status")
const {  User } = require('../models/database');

sequelize.sync().then(() => {
  console.log('Models synchronized with database in postsController');
});


const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const data = posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      image: post.image,
      createdAt: new Date(post.createdAt),
      carePlant: post.carePlant,
      whoTakeCare: post.whoTakeCare,
      user: {
        id: post.User.id,
        firstName: post.User.firstName,
        lastName: post.User.lastName,
      },
    }));

    res.send(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const getImage = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);

    if (!post) {
      console.log(`Post with id ${id} not found`);
      return res.status(404).send({ message: 'Publication non trouvée' });
    }

    res.setHeader('Content-Type', 'image/jpeg');

    // Vérifier si l'image est encodée en base64
    if (post.image.startsWith('data:image')) {
      // Si c'est une image encodée en base64, renvoyer la chaîne base64 directement
      return res.send(post.image);
    }

    // Si ce n'est pas une image encodée en base64, renvoyer l'URL de l'image
    const imagePath = path.join(__dirname, '..', 'path', 'to', 'your', 'image', post.image);
    return res.sendFile(imagePath);
  } catch (err) {
    console.error('Error retrieving image:', err);
    res.status(500).send('Erreur lors de la récupération de l\'image');
  }
};

async function savePhoto(req, res) {

  const {token, title, description, image, carePlant, whoTakeCare} = req.body;

  try {
    const decodedToken = jwt.verify(token, "arosaje")
    const userData = await User.findByPk(decodedToken.userId);

    if (!userData) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const carePlantBool = carePlant ? 1 : 0;

    const createdPost = await Post.create({ 
      UserId: userData.id,
      title: title,
      description: description,
      image: image,
      carePlant: carePlantBool,
      whoTakeCare: whoTakeCare,
    });

    const postWithUser = {
      id: createdPost.id,
      title: createdPost.title,
      createdAt: createdPost.createdAt,
      user: {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      whoTakeCare: createdPost.whoTakeCare,
    };

    res.status(201).json(postWithUser);
  } catch (error) {
    console.error('Error verifying JWT:', error);
    res.status(401).json({ message: "Token JWT invalide" });
  }
}

const carePlant = async (req, res) => {
    const { postId, whoTakeCare } = req.body;
    
    try {
  
      // Récupérer le post par son ID
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).send({ message: 'Publication non trouvée' });
      }
      
      // Assurer que l'id de l'utilisateur est associé au post
      await post.update({ carePlant: 1, whoTakeCare: whoTakeCare});
      
      res.send({ message: 'Publication mise à jour avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la mise à jour de la publication');
    }
  };

  const deletePostByAdmin = async (req, res) => {
    const { id } = req.body;
    
    try {

      await Post.destroy({
        where: { id: id},
      });
  
      res.status(200).send({status: Status.DELETE_POST});
    } catch (err) {
      console.error('Error during deleting of this post', err);

    }
  };

module.exports = { 
  getImage,
  savePhoto,
  getPosts,
  carePlant,
  deletePostByAdmin,
};

