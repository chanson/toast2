import React from 'react'
import firebase from 'react-native-firebase'

export function currentUserId() {
  return firebase.auth().currentUser.uid
}

export function getWeddingsForUser(userId) {
  return firebase.firestore().collection('weddings').where('user_id', '==', userId).get()
}

export function getWeddingTodosForUser(userId) {
  return firebase.firestore().collection('wedding_todos').where('user_id', '==', userId).get()
}
