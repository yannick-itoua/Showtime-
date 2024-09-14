module.exports.sendUserHTMLfile =
   (_,res) =>  {
      const options = {
                     root: 'public',
                     headers: {
                       'x-timestamp': Date.now(),
                       'x-sent': true
                     }
                   };
      res.sendFile('showtime-app.html', options);
  }
  
module.exports.sendAdminHTMLfile =
   (_,res) =>  {
      const options = {
                     root: 'public',
                     headers: {
                       'x-timestamp': Date.now(),
                       'x-sent': true
                     }
                   };
      res.sendFile('showtime-app-admin.html', options);
  } 
