firebase.auth().onAuthStateChanged(async function(user) {

  if (user) {
    // Signed in

    console.log('signed in')
    let db = firebase.firestore()

    // put an event listener on the sign out button
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })


    // direct traffic based on who logged in
        // if user doesn't have a pending order, direct them to the order page
        // if user has a pending order, direct them to that page
        console.log(user.uid)
        let querySnapshot = await db.collection('orders')
              .where('userID', '==', user.uid)
              .where('status', '==', 'pending')
              .get()
        
          console.log(querySnapshot.size)
      if (querySnapshot.size == 0){// there's no pending orders, display order page
          // add html to create the order page
            document.querySelector('.order-page').innerHTML = 
            `
                <form class="text-center mt-8" action="index.html">

                <div class="course">
              <label class = "text-white text-xl">Choose a Course:</label>
              <select class = "course-selected" name="course" id="courseName">
                <option value="Sunset Hills">Sunset Hills</option>
                <option value="Augusta National">Augusta National</option>
                <option value="Pine Brook">Pine Brook</option>
                <option value="Saddle Ridge">Saddle Ridge</option>
              </select>
              </div>
              
              <div class="hole mt-8">
                  <label class = "text-white text-xl mt-8">Hole Location:</label>
                  <select class = "hole-selected" name="hole" id="holeNumber">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                  </select>
              </div>
              
              <div class="premium-button mt-8">
                  <button class="block mx-auto text-white bg-blue-400 rounded px-4 py-8 hover:bg-red-500">Request Premium Service</button> 
              </div>
              
              <div class="standard-button mt-8">
                  <button class="block mx-auto text-white bg-gray-400 rounded px-4 py-8 hover:bg-red-500 mb-2">Request Standard Service</button> 
              </div>
              
              
              </form>
              
              <img class ="rounded border mt-8 h-32 mx-auto border-white"src="https://golf.com/wp-content/uploads/2020/07/GettyImages-996178446.jpg">
            
            
            
            `

        // order page: Add a bunch of event listeners

             
        // order buttons (could probably do this with 1 section of code with a tweak based on premium vs std)
            // put at order button in the empty div for it
            
        
            // stores values from html inputs on the course and hole #, and current time
                
              let std_order = document.querySelector('.standard-button')
              std_order.addEventListener('click', async function(event){
                event.preventDefault()
                
                let course = document.querySelector('.course-selected').value
                
                let hole = document.querySelector('.hole-selected').value
                // will need to add error handling later if no course/hole selected

                console.log(`${course}-hole${hole}`)
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
                // refresh page, which will move us to a pending order screen
                document.location.href = 'index.html'
              })
 
      }
    
      else {  // there's a pending order, so display that info and a cancel button 

              let orderdetails = querySnapshot.docs[0].data()
              console.log(orderdetails)
              let ordernum = querySnapshot.docs[0].id
              let timeleft = orderdetails.promisetime - firebase.firestore.FieldValue.serverTimestamp()            
              
              // update html to display order details and wait time
              document.querySelector('.orderdetails').innerHTML =  
              `
              <div class="mt-8 ">
                  <h1 class="text-center text-2xl text-white"> Attendant Requested!</h1>]
                  <h2 class="text-center text-2xl text-white"> ETA:XX Minutes</h2>
              </div>

              <div class="mt-8">
                  <button class="cancel block mx-auto text-white bg-red-600 rounded px-14 py-2 hover:bg-yellow-500 mb-2">Cancel Request</button> 
              </div>

              <img class ="rounded border mt-8 h-32 mx-auto border-white"src="https://golf.com/wp-content/uploads/2020/07/GettyImages-996178446.jpg">
              `
        
        // add event listeners to buttons
            
            // cancel button
                // grab current order info
                    // should already be stored at this point...
            
                  let cancelbutton = document.querySelector('.cancel')
                  console.log(cancelbutton)
                    // send to firebase w/ update on "status" to cancelled
                document.querySelector('.cancel').addEventListener('click', async function(event){
                  await db.collection('orders').doc(ordernum).update({
                    status: 'cancelled'
                  })

                  // move back to order page
                      document.location.href = 'index.html'

                })
      }    
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