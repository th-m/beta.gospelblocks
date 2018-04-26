const baseURL = "https://api.gospelblocks.com/v1/"


export function getVolumes(){
 return fetch(baseURL+'volumes').then(function(response) {
    return response.json();
  }).then(function(obj) {
    return obj.volumes.filter(x => x.id <= 10);
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
    return obj.chapters;
  });
}
export function getVerses(v,b,c){
  // console.log(baseURL+'volume/'+v+'/book/'+b+'/chapter/'+c);
 return fetch(baseURL+'volume/'+v+'/book/'+b+'/chapter/'+c).then(function(response) {
    return response.json();
  }).then(function(obj) {
    return obj.verses;
  });
}
export function scriptureSearch(s, p = 1,v = null ,b = null ,c = null){
  // http://api.gospelblocks.com/v1/search/dragon||wine
  // TODO book id needs to be fixed;
  let url = baseURL+'search/'+s;
  
  if(v){
    url += "/"+v;
  }
  if(b){
    url += "/"+b;
  }
  if(c){
    url += "/"+c;
  }
  if(p){
    url += "/"+p;
  }
  console.log(url);
  
  return fetch(url).then(function(response) {
     return response.json();
   }).then(function(obj) {
     return obj.verses;
   });
}
