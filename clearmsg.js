// npm install mongodb
var mongodb = require('mongodb')
  , MongoClient = mongodb.MongoClient
 
MongoClient.connect("mongodb://willtheuser:password1@kahana.mongohq.com:10020/app27110801", function(err, db) {
  // operate on the collection named "test"
  var collection = db.collection('messages')
 
  // remove all records in collection (if any)
  console.log('removing documents...')
  collection.remove(function(err, result) {
    if (err) {
      return console.error(err)
    }
    console.log('collection cleared!')
    // insert two documents
    console.log('inserting new documents...')
    collection.insert([{name: 'system', message: 'just cleared message history, ready for a new start!'}], function(err,
docs) {
      if (err) {
        return console.error(err)
      }
      console.log('just inserted ', docs.length, ' new documents!')
      collection.find({}).toArray(function(err, docs) {
        if (err) {
          return console.error(err)
        }
        docs.forEach(function(doc) {
          console.log('found document: ', doc)
        })
      })
    })
  })
})