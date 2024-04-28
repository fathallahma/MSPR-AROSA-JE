import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Card, Divider } from 'react-native-elements';
import axios from 'axios';
import Port from "../utils/portServer";
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/publicationStyle';
import { useSelector } from "react-redux";

axios.defaults.baseURL = Port.LOCALHOST_WEB;

const PublicationAdmin = () => {
  const userData = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [takenCarePosts, setTakenCarePosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        const data = response.data.map((post) => {
          return {
            id: post.id,
            title: post.title,
            description: post.description,
            image: post.image,
            user: post.user,
            createdAt: new Date(post.createdAt),
            carePlant: post.carePlant,
            whoTakeCare: post.whoTakeCare,
          };
        });

        const takenCarePosts = data.filter(post => post.carePlant);
        setTakenCarePosts(takenCarePosts);

        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [refreshKey]);

  const updateDataPage = async (postId) => {
    setSelectedPost(postId);
    try {
      await confirmationCare(posts.find(item => item.id === postId));
    } catch (error) {
      console.error(error);
    }
  };

  const confirmationCare = async (item) => {
    const { firstName } = userData;
    const whoTakeCare = firstName;

    try {
      await axios.put('/care-plant-post', { postId: item.id, whoTakeCare: whoTakeCare });
      setTakenCarePosts([...takenCarePosts, item]);
      setSelectedPost(null);
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => {
    const isTakenCare = takenCarePosts.some((post) => post.id === item.id);

    return (
      <Card containerStyle={styles.card}>
        <View style={styles.userContainer}>
          <Icon name="user" size={20} color="#333" />
          <Text style={styles.titleUser}>{item.user.firstName} {item.user.lastName} {item.id}</Text>
        </View>

        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
        <Text style={styles.title}>{item.title}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.timestamp}>{item.createdAt.toLocaleString()}</Text>

          {!item.carePlant && !isTakenCare && (
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
                padding: 10,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => updateDataPage(item.id)}
            >
              <FontAwesome name="heart" size={24} color="white" />
              <Text style={{ color: 'white' }}> J'en prends soin</Text>
            </TouchableOpacity>
          )}

          {isTakenCare && (
            <TouchableOpacity
              disabled={true}
              style={{
                backgroundColor: 'gray',
                padding: 10,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome name="ban" size={24} color="white" />
              <Text style={{ color: 'white' }}>
                {` La plante est déjà prise par ${item.whoTakeCare || 'quelqu\'un'}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        key={refreshKey}
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default PublicationAdmin;
