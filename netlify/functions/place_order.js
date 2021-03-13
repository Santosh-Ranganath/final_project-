let firebase = require('./firebase')

exports.handler = async function(event) {

  console.log('new order!')
  let db = firebase.firestore()                            
  
  
  let body = JSON.parse(event.body)
  console.log('order:')
  console.log(body)

  let docRef =  await db.collection('orders').add(body)

  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}