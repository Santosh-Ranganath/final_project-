firebase.auth().onAuthStateChanged(async function(user) {

  if (user) { // Signed in
 
    console.log('signed in')
    let db = firebase.firestore()

    // Time information Calculation for entire script 
    let currentDate = new Date() 
    let currentHour = (currentDate.getHours() < 10) ? "0" + currentDate.getHours() : currentDate.getHours()
    let currentMinute = (currentDate.getMinutes() < 10) ? "0" + currentDate.getMinutes() : currentDate.getMinutes()
    let currentTime = currentHour + ":" + currentMinute 
    // console.log(currentDate)
    let fifteenminutesLater = new Date(currentDate.getTime() + (15*60*1000))
    let formatHour = (fifteenminutesLater.getHours() < 10) ? "0" + fifteenminutesLater.getHours() : fifteenminutesLater.getHours()
    let formatMinute = (fifteenminutesLater.getMinutes() < 10) ? "0" + fifteenminutesLater.getMinutes() : fifteenminutesLater.getMinutes()
    let standardTime = formatHour + ":" + formatMinute

    let fiveminutesLater = new Date(currentDate.getTime() + (5*60*1000))
    let formatHourPremium = (fiveminutesLater.getHours() < 10) ? "0" + fiveminutesLater.getHours() : fiveminutesLater.getHours()
    let formatMinutePremium = (fiveminutesLater.getMinutes() < 10) ? "0" + fiveminutesLater.getMinutes() : fiveminutesLater.getMinutes()
    let premiumTime = formatHourPremium + ":" + formatMinutePremium
    // console.log(`Your ETA is ${premiumTime} `)

    //adds the navigation buttons only when a user is logged in 
    document.querySelector('.navigation').insertAdjacentHTML('beforeend',
    `<a href ="index.html" class = "sign-out text-white text-md bg-blue-600 rounded p-2 hover:bg-yellow-300 text-center">Logout</a>
    `)

    // put an event listener on the sign out button
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })

    // pull in information on current courses available--is this 4 arrays of 4 vs. 1 array of 4?
      let courseSnapshot = await db.collection('courses').orderBy('name').get()
      let courses = []
      for (i=0; i<courseSnapshot.size; i++){
        courses[i] = courseSnapshot.docs[i].data()
      }

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
                
              </select>
              </div>
              
              <div class="hole mt-8">
                  <label class = "text-white text-xl mt-8">Hole Location:</label>
                  <select class = "hole-selected" name="hole" id="holeNumber">
                    
                  </select>
              </div>
              
           
                  <button class="premium-button mt-8 block mx-auto text-white bg-blue-400 rounded px-4 py-8 hover:bg-red-500">Request Premium Service <p>(ETA: ${premiumTime}) </button> 
            
              
              
                  <button class="standard-button mt-8 block mx-auto text-white bg-gray-400 rounded px-4 py-8 hover:bg-red-500 mb-2">Request Standard Service <p>(ETA: ${standardTime})</p></button> 
             
              
              
              </form>
              
              <div class = "image-selected"> </div>
              
            
            `

        // dynamically update course selection from firebase
          for (i=0; i<courses.length; i++) {
            document.querySelector('.course-selected').insertAdjacentHTML('beforeend', 
            `
            <option value="${courses[i].name}">${courses[i].name}</option>
            `
            )
          }
         
        // dyanmically update the #holes and Img based on default course selection
            updateholes(courses[0].name)
            updateimg(courses[0].name)
        
        // event listener to update hole #'s and Img once a new course is selected
          document.querySelector('.course-selected').addEventListener('change', async function(event) {
            let course = document.querySelector('.course-selected').value
            updateholes(course)
          })
          
          document.querySelector('.course-selected').addEventListener('change', async function(event) {
            let course = document.querySelector('.course-selected').value
            updateimg(course)
          })
        
            // order page: Add a bunch of event listeners

             
        // order buttons (could probably do this with 1 section of code with a tweak based on premium vs std)
            // put at order button in the empty div for it
            
        
            // stores values from html inputs on the course and hole #, and current time
                
              let std_order = document.querySelector('.standard-button')
              std_order.addEventListener('click', async function(event){
                event.preventDefault()
                
                course = document.querySelector('.course-selected').value
                
                let hole = document.querySelector('.hole-selected').value
                // will need to add error handling later if no course/hole selected

                console.log(`${course}-hole${hole}`)
                let ordertime = currentTime
                
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
                  promisetime: standardTime
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
              // console.log(orderdetails)
              let ordernum = querySnapshot.docs[0].id
              let timeleft = orderdetails.promisetime - currentTime          
              console.log(currentTime)
              console.log(orderdetails.promisetime)
              console.log(timeleft)
              // update html to display order details and wait time
              document.querySelector('.orderdetails').innerHTML =  
              `
              <div class="mt-8 ">
                  <h1 class="text-center text-2xl text-white"> Attendant Requested!</h1>
                  <h2 class="text-center text-2xl text-white"> ETA: ${timeleft}</h2>
              </div>

              <div class="mt-8">
                  <button class="cancel block mx-auto text-white bg-red-600 rounded px-14 py-2 hover:bg-yellow-500 mb-2">Cancel Request</button> 
              </div>

              <div class=" mt-8">
                  <button class="complete block mx-auto text-white bg-blue-500 rounded px-14 py-2 hover:bg-yellow-500 mb-2">Order Complete</button> 
              </div>

              <img class ="rounded border mt-8 h-32 mx-auto border-white"src="https://golf.com/wp-content/uploads/2020/07/GettyImages-996178446.jpg">
              `
        
        // add event listeners to buttons
            
            // cancel button
                // grab current order info
                    // should already be stored at this point...
            
                  let cancelbutton = document.querySelector('.cancel')
             
                    // send to firebase w/ update on "status" to cancelled
                document.querySelector('.cancel').addEventListener('click', async function(event){
                  await db.collection('orders').doc(ordernum).update({
                    status: 'cancelled'
                  })
                  // move back to order page
                      document.location.href = 'index.html'

                })

          // same thing for order complete button
                    let completebutton = document.querySelector('.complete')
                      
                    // send to firebase w/ update on "status" to cancelled
                document.querySelector('.complete').addEventListener('click', async function(event){
                  await db.collection('orders').doc(ordernum).update({
                    status: 'complete'
                  })
                  // move back to order page
                      document.location.href = 'index.html'

                })
      }    
            // refresh?  a button to refresh from firebase, or we code in an autorefresh once/min?

  

  } else {  // Signed out
   
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

async function updateholes(course) { //updates the hole selection drop down based on name of course
  let db = firebase.firestore()
 
  let holeSnapshot = await db.collection('courses')
                                     .where('name', '==', course)
                                     .get()
          let holes = holeSnapshot.docs[0].data()

  // first clear out any html in the drop down to start fresh
  document.querySelector('.hole-selected').innerHTML = null

  // then add new html for the # of holes
          
          for (i=1; i<holes.holes+1; i++) {
            document.querySelector('.hole-selected').insertAdjacentHTML('beforeend', 
            `
            <option value="${i}">${i}</option>
            `
            ) 
          }

}

async function updateimg(course) { //updates the img selection drop down based on name of course
  let db = firebase.firestore()
 
  let imgSnapshot = await db.collection('courses')
                                     .where('name', '==', course)
                                     .get()
          let img = imgSnapshot.docs[0].data()
        // console.log(img.image)

  // first clear out any html in the div down to start fresh
  document.querySelector('.image-selected').innerHTML = null

  // then add new html for the img
          
         
            document.querySelector('.image-selected').insertAdjacentHTML('beforeend', 
            `
            <img class ="rounded border mt-8 h-32 mx-auto border-white"src="${img.image}">

            `)
}