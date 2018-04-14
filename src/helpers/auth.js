import { ref, firebaseAuth } from '../config/constants'

export function auth (email, pw, username) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(d => {
      saveUser(d, username);
    })
}

// export function authState(user){
//   return firebaseAuth().onAuthStateChanged(user)
// }

export function checkUsername (username, successCallback, failCallback) {
  return ref.child('users').once("value", function(snapshot) {
      let users = snapshot.val();
      let isUnique = true;
      Object.keys(users).forEach( (key) => {
          if(users[key].info.username === username){
            isUnique = false;
          }
      });
      
      if(isUnique){
        successCallback();
      }else{
        failCallback();
      }
      
  });
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user, username) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid,
      username: username
    })
    .then(() => user)
}

export function userEmailProviders(email){
    return firebaseAuth().fetchProvidersForEmail(email);
}