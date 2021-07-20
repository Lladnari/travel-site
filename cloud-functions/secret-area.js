exports.handler = function(event, context, callback) {
   // Cloud function for node environment.

   callback(null, {
      statusCode: 200,
      body: "Welcome to the super secret area"
   }); // callback()
} // exports.handler
