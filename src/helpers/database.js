import { ref, db } from '../config/constants'
// import { _ } from 'lodash';
// var _ = require('lodash');

function generateId(){
  let bid = "";
  // const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    bid += possible.charAt(Math.floor(Math.random() * possible.length));
  return bid;
}

export function validateYouTubeUrl(url){
        if (url !== undefined || url !== '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
            // var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/; NOTE this was original before following warnign suggestions
            var match = url.match(regExp);
            if (match && match[2].length === 11) {
                // Do anything for being valid
                // if need to change the url to embed url then use below line
                return 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0';
            }
            else {
                return false;
            }
        }
}

export function generateLongId(){
  let bid = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++)
    bid += possible.charAt(Math.floor(Math.random() * possible.length));
  return bid;
}

function getNewId() {
  let bid = generateId();
  return ref.child('blocks/'+bid).once('value').then(snapshot => {
    let exists = (snapshot.val() !== null)
    return (!exists ? bid : getNewId());
  });
}


function clean(obj) {
  var propNames = Object.getOwnPropertyNames(obj);
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i];
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
}


// NOTE this is a really bad way to do this. TODO improve multiselect to hold data sepearate from display
function getUserIdsFromUsername (usernames) {
  return ref.child('users').once("value", function(snapshot) {
      let users = snapshot.val();
      return Object.keys(users).map( (key) => {
          if(usernames.includes(users[key].info.username)){
            return key
          }
      });
      
      
  });
}

export function getUsername (uid) {
  return db.ref('users/'+uid+'/info/username').once("value").then(snapshot => {
    return snapshot.val();
  });
}
export function getBlockInfo (bid) {
  return db.ref('blocks/'+bid).once("value").then(snapshot => {
    return snapshot.val();
  });
}

export function getUsersList(){
  const path = '/users/';
  return  db.ref(path).once('value').then(function(data) {
    // let d = data.val();
    // return Object.keys(d).map(x => d[x].info);
    return data.val();
  })
}

export function getBlock({destructure_obj}){
  return "false";
}

export function createBlock(block, uid){
  console.log(block);
  // clean the object of any empty values
  clean(block);
  
  // if we have a id provided to the function we will use that 
  if(block.id){
    console.log("we already have an id", block.id);
    let updates = {};
    block.created = Date().toLocaleString();
    updates['/blocks/' + block.id] = block;
    return ref.update(updates).then(x =>  block.id);
  }else{
    return getNewId().then(id => {
      console.log("the fired get new id", id);
      let updates = {};
      block.created = Date().toLocaleString();
      block.id = id;
      block.creatorId = uid;
      updates['/blocks/' + id] = block;
      return ref.update(updates).then(x => id);
    }); 
  }
}

export function pinBlock(uid, blockId){
  // let updates = {};
  const path = 'users/'+ uid +'/pinnedBlocks';
  return  db.ref(path).once('value').then(function(data) {
    let pins = {'1': blockId};
    if(data.val()){
      pins = data.val();
      pins[Object.keys(pins).length+1] = blockId;
    }
    update(path, pins);
  })
    // upd
  // updates['users/'+ uid +'/pinnedBlocks/' + blockId] = blockId;
  // return ref.update(updates);
}

// export function updateList(path, arr){
//   update(path, arr);
// }

export function updateChildren(blockId, childId){
  const path = '/blocks/'+ blockId +'/children';
  return  db.ref(path).once('value').then(function(data) {
    let children = {'1': childId};
    if(data.val()){
      children = data.val();
      // console.log(children, children.values());
      if(!Object.values(children).includes(childId)){
        children[Object.keys(children).length+1] = childId;
      }
    }
    
    update(path, children);
  })
}
export function addBit(blockId, bit, order = null){
  const path = '/blocks/'+ blockId +'/bits';
  return  db.ref(path).once('value').then(function(data) {
    let bits = {'1':bit};
    if(data.val()){
      bits = data.val();
      if(order){
       Object.keys(bits).reverse().forEach(x => {
          if(x >= order){
              bits[parseInt(x, 10) + 1] = bits[x];
          }else{
            bits[x] = bits[x];
          }
        })
        bits[order] = bit;
        console.log(bits);
      }else{
        bits[Object.keys(bits).length+1] = bit;
      }
    }
    update(path, bits);
  })
}

export function update(path, data){
  // console.log("data base update",path, data);
  return db.ref(path).set(data);
}


export function trash(uid,blockId){

  db.ref(`blocks/${blockId}`).once('value').then(function(data) {
    
    // NOTE check if pinned block;
    db.ref(`users/${uid}/pinnedBlocks`).once('value').then(function(data) {
        if(data.val()){
          let k = Object.entries(data.val()).filter(x => {return x[1] === blockId} );
          if(k[0] && k[0][0]){
            db.ref(`users/${uid}/pinnedBlocks/${k[0][0]}`).remove();
          }
        }
    })
    
    // NOTE check if has a parent;
    let blockData = data.val();
    if(blockData.parentBlockId){
      db.ref(`blocks/${blockData.parentBlockId}/children`).once('value').then(function(data) {
          if(data.val()){
            let l = Object.entries(data.val()).filter(x => {return x[1] !== blockId} ).map(x => x[1]);
            update(`blocks/${blockData.parentBlockId}/children`, l);
          }
      })
    }
    
    db.ref(`blocks/${blockId}`).once('value').then(function(data){
      db.ref(`trash/${uid}/blocks/${blockId}`).set(data.val());
      db.ref(`blocks/${blockId}`).remove();
    })
  })
  
}

export function listen(path){
  return db.ref(path);
}


// Helper functions 
// NOTE this function is used when reducing lists of blockIds in preperation for updates to firebase.
export function reduceList (r, obj){
  for(var key in obj) {
      if (obj.hasOwnProperty(key)) {
          r[key] = obj[key];
      }
  }
  return r;
}