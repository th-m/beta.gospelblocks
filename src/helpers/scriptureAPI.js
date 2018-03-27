const baseURL = "https://api.gospelblocks.com/v1/"


export function getVolumes(){
 return fetch(baseURL+'volumes').then(function(response) {
    return response.json();
  }).then(function(obj) {
    return obj.volumes.filter(x => x.id <= 5);
  });
}
export function getBooks(v){
 return fetch(baseURL+'volume/'+v).then(function(response) {
    return response.json();
  }).then(function(obj) {
    return obj.books;
  });
}
export function getChapters(v,b){
 return fetch(baseURL+'volume/'+v+'/book/'+b).then(function(response) {
    return response.json();
  }).then(function(obj) {
    // console.log(obj);
    return obj.chapters;
  });
}
export function getVerses(v,b,c){
  // console.log(baseURL+'volume/'+v+'/book/'+b+'/chapter/'+c);
 return fetch(baseURL+'volume/'+v+'/book/'+b+'/chapter/'+c).then(function(response) {
    return response.json();
  }).then(function(obj) {
    console.log(obj)
    return obj.verses;
  });
}
