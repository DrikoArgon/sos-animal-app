const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.addMessage = functions.https.onRequest((request, response) => {

    const original = request.query.text

    admin.database().ref('/messages').push({original: original})
    .then((snapshot) => {
        response.redirect(303,snapshot.ref)
    })

});

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original').onWrite((event) => {

    const original = event.data.val()
    console.log('Uppercasing',event.params.pushId, original)
    const uppercase = original.toUpperCase()

    return event.data.ref.parent.child('uppercase').set(uppercase)
})
