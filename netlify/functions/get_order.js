let firebase = require('./firebase')

exports.handler = async function(event) {


  let db = firebase.firestore()                            
  
  
  let body = JSON.parse(event.body)
  let userId = body.userId
  let orderdetails = []

  console.log(userId)
  let querySnapshot = await db.collection('orders')
              .where('userID', '==', userId)
              .where('status', '==', 'pending')
              .get()

    console.log(querySnapshot.size)
    if (querySnapshot.size == 0) { //no pending orders
        orderdetails = null
        console.log('no orders')
    }
    else {
      console.log('found an order')
      orderdetails = querySnapshot.docs[0].data()
      orderdetails.orderId = querySnapshot.docs[0].id
    }
  

  return {
    statusCode: 200,
    body: JSON.stringify(orderdetails)
  }
}