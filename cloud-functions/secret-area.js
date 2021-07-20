exports.handler = function(event, context, callback) {
   // Cloud function for node environment.
   const secretContent = `
   <h3>Welcome to the Secret Area</h3>
   <p>Here we can tell you that the sky is <strong>blue</strong> and two plus 2 is four.</p>
   `;

   let body;

   if (event.body) {
      body = JSON.parse(event.body);
   } else {
      body = {};
   } // end if().

   if (body.password == "javascript") {
      callback(null, {
         statusCode: 200, // Success.
         body: secretContent
       }); // callback()
   } else {
      callback(null, {
         statusCode: 401, // Unauthorized.
         body: "<h1>Unauthorized</h1>"
      }); // callback()

   } // end else(==)

} // exports.handler
