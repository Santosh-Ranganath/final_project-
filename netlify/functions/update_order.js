let firebase = require('./firebase')

exports.handler = async function(event) {


  let db = firebase.firestore()                            
  
  
  let body = JSON.parse(event.body)


  await db.collection('orders').doc(body.orderId).update({
    status: body.status
  })

  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}