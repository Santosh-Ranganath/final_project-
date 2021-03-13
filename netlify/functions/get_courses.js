let firebase = require('./firebase')

exports.handler = async function(event) {


  let db = firebase.firestore()                            
  let courseData = [] 

  let courseSnapshot = await db.collection('courses').orderBy('name').get()
     
      for (i=0; i<courseSnapshot.size; i++){
        courseData[i] = courseSnapshot.docs[i].data()
      }

  return {
    statusCode: 200,
    body: JSON.stringify(courseData)
  }
}