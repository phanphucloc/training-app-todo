 
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: 'AIzaSyDt37k3ANjy4K9JgMyuM0ASvrQU923pLcg',
    authDomain: 'todo-api-c4774.firebaseapp.com',
    databaseURL: 'https://todo-api-c4774.firebaseio.com',
    projectId: 'todo-api-c4774',
    storageBucket: 'todo-api-c4774.appspot.com',
    messagingSenderId: '394615533050',
    appId: '1:394615533050:web:e8fedfb447dde641c74843',
    measurementId: 'G-6CHP0E88FR'
  });

const messaging = firebase.messaging();