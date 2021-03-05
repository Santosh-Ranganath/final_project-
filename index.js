firebase.auth().onAuthStateChanged(async function(user) {
      


  if (user) {
    // Signed in
    console.log('signed in')

    // direct traffic based on who logged in
        // if user doesn't have a pending order, direct them to the order page
        // if user has a pending order, direct them to that page



    // order page: Add a bunch of event listeners

        // Log out button
              // executes some firebase code to logout


        // order buttons (could probably do this with 1 section of code with a tweak based on premium vs std)
              // stores values from html inputs on the course and hole # 
              // also logs the current time
              // lambda function later: send these things to firebase
              // move to pending order page (or reformat index.html to look that way)

    
    // on the order pending page...
        // go get details on the current order
              // lambda function:  pull outstanding order for that user from firebase
              // update html to display order details and wait time
        
        // add event listeners to buttons
            // log out button w/ firebase code
            // cancel button
                // grab current order info
                // send to firebase w/ update on "status" to cancelled
                // move back to order page
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