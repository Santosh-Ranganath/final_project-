firebase.auth().onAuthStateChanged(async function(user) {

  
  
  if (user) {
    // Signed in
    console.log('signed in')
    let db = firebase.firestore()
    // direct traffic based on who logged in
        // if user doesn't have a pending order, direct them to the order page
        // if user has a pending order, direct them to that page

    // order page: Add a bunch of event listeners

        // Log out button
              // Put the button in an empty div created for it
              document.querySelector('.sign-in-or-sign-out').innerHTML = `
                <button class="text-pink-500 underline sign-out">Sign Out</button>
              `
              // event listener to actually sign out when clicked
              document.querySelector('.sign-out').addEventListener('click', function(event) {
                console.log('sign out clicked')
                firebase.auth().signOut()
                document.location.href = 'index.html'
              })

        // order buttons (could probably do this with 1 section of code with a tweak based on premium vs std)
            // put at order button in the empty div for it
            document.querySelector('.order-button').innerHTML = `
            <button class="text-blue-500 underline std_order">Order!</button>
             `
        
            // stores values from html inputs on the course and hole #, and current time
                
              let std_order = document.querySelector('.std_order')
              std_order.addEventListener('submit', async function(event){
                let course = document.querySelector('.course').value
                let hole = document.querySelector('hole').value
                // will need to add error handling later if no course/hole selected
                let ordertime = firebase.firestore.FieldValue.serverTimestamp()
                let priority = 'standard'
                let userID = user.uid
                let status = 'pending'

                // send this info to firebase (move to lambda function later)

                let order = {
                  course: course,
                  hole: hole,
                  ordertime: ordertime,
                  priority: priority,
                  userID: userID,
                  status: status,
                  promisetime: ordertime + 15
                  // add some complexity later for dynamic wait times based on order volume?
                }
                let db = firebase.firestore()
                let docRef =  await db.collection('orders').add(order)
                let ordernum = docRef.id

                // move to a pending order screen
                // this refreshes page... maybe divert to separate html page?
                document.location.href = 'index.html'
              })
 
            
    // on the order pending page...
        // go get details on the current order
              // lambda function:  pull outstanding order for that user from firebase
              
              let querySnapshot = await db.collection('orders')
              .where('userId', '==', user.uid)
              .where('status', '==', 'pending')
              .get()

              let orderdetails = querySnapshot.docs
              let timeleft = orderdetails.promisetime - firebase.firestore.FieldValue.serverTimestamp()            
              
              // update html to display order details and wait time
              document.querySelector('.orderdetails').insertAdjacentHTML('beforeend', `
              <div>
                  <div>
                    Wait time: ${timeleft} Minutes
                    </div>
              </div>`)
        
        // add event listeners to buttons
            // log out button w/ firebase code
                  // Put the button in an empty div created for it
                  document.querySelector('.sign-in-or-sign-out').innerHTML = `
                  <button class="text-pink-500 underline sign-out">Sign Out</button>
                  `
                  // event listener to actually sign out when clicked
                  document.querySelector('.sign-out').addEventListener('click', function(event) {
                  console.log('sign out clicked')
                  firebase.auth().signOut()
                  document.location.href = 'index.html'
                  })
            // cancel button
                // grab current order info
                    // should already be stored at this point...
                // send to firebase w/ update on "status" to cancelled
                      await db.collection('orders').update({
                        status: 'cancelled'
                      })

                // move back to order page
                    document.location.href = 'index.html'
            // refresh?  a button to refresh from firebase, or we code in an autorefresh once/min?

  

  } else {
    // Signed out
    console.log('signed out')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)

    // we will need to insert some HTML here in order to add our logo/customize the login screen



  }
})


// Any functions created go below this line (outside the firebase stuff)