firebase.auth().onAuthStateChanged(async function(user) {

  if (user) { // Signed in
 
    console.log('signed in')
    

    // Time information Calculation for entire script 
    let currentDate = new Date() 
    // let currentHour = (currentDate.getHours() < 10) ? "0" + currentDate.getHours() : currentDate.getHours()
    // let currentMinute = (currentDate.getMinutes() < 10) ? "0" + currentDate.getMinutes() : currentDate.getMinutes()
    let currentTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
    // console.log(currentTime)
    let fifteenminutesLater = new Date(currentDate.getTime() + (15*60*1000))
    // let formatHour = (fifteenminutesLater.getHours() < 10) ? "0" + fifteenminutesLater.getHours() : fifteenminutesLater.getHours()
    // let formatMinute = (fifteenminutesLater.getMinutes() < 10) ? "0" + fifteenminutesLater.getMinutes() : fifteenminutesLater.getMinutes()
    let standardTime = fifteenminutesLater.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });

    let fiveminutesLater = new Date(currentDate.getTime() + (5*60*1000))
    // let formatHourPremium = (fiveminutesLater.getHours() < 10) ? "0" + fiveminutesLater.getHours() : fiveminutesLater.getHours()
    // let formatMinutePremium = (fiveminutesLater.getMinutes() < 10) ? "0" + fiveminutesLater.getMinutes() : fiveminutesLater.getMinutes()
    let premiumTime = fiveminutesLater.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
    // let waitTime = (fifteenminutesLater-fiveminutesLater)/60000
    // console.log(`Your ETA is ${waitTime} `)
    // console.log((fifteenminutesLater-fiveminutesLater)/60000)

    console.log('play w/numbers')
    console.log(fifteenminutesLater)
    console.log(fifteenminutesLater.getFullYear())
    console.log(fifteenminutesLater.getMinutes())
    console.log(fifteenminutesLater.getMonth())

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

    // pull in information on current courses available
     
      let response = await fetch('/.netlify/functions/get_courses')
      let courses = await response.json()
      console.log(courses)

    // direct traffic based on who logged in
        // if user doesn't have a pending order, direct them to the order page
        // if user has a pending order, direct them to that page

        response = await fetch('/.netlify/functions/get_order', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.uid,
          })
        })
        let orderdetails = await response.json()
       
        
         
      if (orderdetails == null){// there's no pending orders, display order page
          // add html to create the order page
            document.querySelector('.order-page').innerHTML = 
            `
                <form class="text-center mt-8" action="index.html">


              <div class="md:flex">
                  <div class="md:w-1/3">
                      <div class=" course">
                          <label class = "text-white text-xl">Choose a Course:</label>
                          <select class = "course-selected" name="course" id="courseName">
                                </select>
                      </div>
                    
                      <div class=" hole mt-8">
                          <label class = "text-white text-xl mt-8">Hole Location:</label>
                          <select class = "hole-selected" name="hole" id="holeNumber">
                            
                          </select>
                      </div>
                  </div>
           
                  <div class="md:w-1/3">
                      <button class="premium-button mt-8 block mx-auto text-white bg-blue-400 rounded px-4 py-8 hover:bg-red-500">Request Premium Service - $5 <p>(ETA: ${premiumTime})</button> 
                
                      <button class="standard-button mt-8 block mx-auto text-white bg-gray-400 rounded px-4 py-8 hover:bg-red-500 mb-2">Request Standard Service - Free <p>(ETA: ${standardTime})</p></button> 
                  </div>

                  <div class = "md:w-1/3 image-selected"> </div>
              </div>
              
              </form> 
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
            updateholes(courses, courses[0].name)
            updateimg(courses, courses[0].name)

        
        // event listener to update hole #'s and Img once a new course is selected
          document.querySelector('.course-selected').addEventListener('change', async function(event) {
            let course = document.querySelector('.course-selected').value
            updateholes(courses, course)
            updateimg(courses, course)
          })
          
          
        
            // order page: Add a bunch of event listeners

        // order buttons 

          //standard order
                
              let std_order = document.querySelector('.standard-button')
              std_order.addEventListener('click', async function(event){
                event.preventDefault()
                
                order(user.uid, currentTime, fifteenminutesLater, 'standard')

              })

              //Start of Premium Button Event Listener 
              let prem_order = document.querySelector('.premium-button')
              prem_order.addEventListener('click', async function(event){
                event.preventDefault()
                
                order(user.uid, currentTime, fiveminutesLater, 'premium')
              })
 
      }
      else {  // there's a pending order, so display that info and a complete/cancel button 

              // let orderdetails = querySnapshot.docs[0].data()
              // console.log(orderdetails)
              let t = orderdetails.promisetime
              let promisetime = new Date(t.year, t.month, t.day, t.hours, t.minutes, t.seconds)
              
              

              let timeleft = (promisetime/1000-(currentDate.getTime()/1000))/60
              let display = Number((timeleft).toFixed(0))
              
              // console.log(currentDate)
              // console.log(currentDate.getTime()/1000)
              // console.log(orderdetails.promisetime.seconds)
              // console.log(display)
              // update html to display order details and wait time

              let displaytext
            if (display >=0 ) {

              displaytext = `
                  <h1 class="text-center text-2xl text-white"> Attendant Requested!</h1>
                  <h2 class="text-center text-2xl text-white"> ETA: ${display} Minutes</h2>            
                   `
            }
            else {
              displaytext = `
              <h1 class="text-center text-2xl text-white"></h1>
              <h2 class="text-center text-2xl text-white"> Order Due! Cheers!</h2> 
              `
              }

              document.querySelector('.orderdetails').innerHTML =  
              `
              <div class="md:flex">
                    <div class="md:w-1/3 mt-8 ">
                        ${displaytext}
                    </div>

                    <div class="md:w-1/3">
                          <div class="mt-8">
                              <button class="cancel block mx-auto text-white bg-red-600 rounded px-14 py-2 hover:bg-yellow-500 mb-2">Cancel Request</button> 
                          </div>
                          <div class=" mt-8">
                              <button class="complete block mx-auto text-white bg-blue-500 rounded px-14 py-2 hover:bg-yellow-500 mb-2">Order Complete</button> 
                          </div>
                    </div>

                    <div class="md:w-1/3">
                      <img class ="rounded border mt-8 h-32 mx-auto border-white"src="https://golf.com/wp-content/uploads/2020/07/GettyImages-996178446.jpg">
                    </div>
              </div>
                      `
        
        // add event listeners to buttons
            
            // cancel button
                // grab current order info
                    // should already be stored at this point...
                         
                    // send to firebase w/ update on "status" to cancelled
                document.querySelector('.cancel').addEventListener('click', async function(event){
                  
                  await fetch('/.netlify/functions/update_order', {
                    method: 'POST',
                    body: JSON.stringify({
                      orderId: orderdetails.orderId,
                      status: 'cancelled'
                    })
                  })
          
                  // move back to order page
                      document.location.href = 'index.html'

                })

          // same thing for order complete button
                 
                      
                    // send to firebase w/ update on "status" to cancelled
                document.querySelector('.complete').addEventListener('click', async function(event){
                  
                  await fetch('/.netlify/functions/update_order', {
                    method: 'POST',
                    body: JSON.stringify({
                      orderId: orderdetails.orderId,
                      status: 'complete'
                    })
                  })
                  // move back to order page
                      document.location.href = 'index.html'

                })
      }    


  

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

async function updateholes(courses, course) { //updates the hole selection drop down based on name of course

        console.log('new course')
        // first clear out any html in the drop down to start fresh
        document.querySelector('.hole-selected').innerHTML = null
    for (let j=0; j<courses.length; j++) {
      
      if(courses[j].name == course) {
        let holes = courses[j].holes

        // then add new html for the # of holes 
        for (i=1; i<holes+1; i++) {
          document.querySelector('.hole-selected').insertAdjacentHTML('beforeend', 
          `
          <option value="${i}">${i}</option>
          `
          ) 
        }
      }
    }

  
  

}

async function updateimg(courses, course) { //updates the img selection drop down based on name of course


  // first clear out any html in the div down to start fresh
  document.querySelector('.image-selected').innerHTML = null

  // then add new html for the imgs
          
      for (let i=0;i<courses.length;i++){
        if(courses[i].name == course) {
               document.querySelector('.image-selected').insertAdjacentHTML('beforeend', 
                  `
                  <img class ="rounded border mt-8 mx-auto h-32 border-white"src="${courses[i].image}">
                  `)
        }
      }     
}

async function order(userId, currentTime, promisetime, service) {

  // send this info to firebase (move to lambda function later)

  await fetch('/.netlify/functions/place_order', {
    method: 'POST',
    body: JSON.stringify({
      course: document.querySelector('.course-selected').value,
      hole: document.querySelector('.hole-selected').value,
      ordertime: currentTime,
      priority: service,
      userID: userId,
      status: 'pending',
      promisetime: {
          year: promisetime.getFullYear(),
          month: promisetime.getMonth(),
          day: promisetime.getDate(),
          hours: promisetime.getHours(),
          minutes: promisetime.getMinutes(),
          seconds: promisetime.getSeconds(),
      }
    })
  })



  // refresh page, which will move us to a pending order screen
  document.location.href = 'index.html'


}

