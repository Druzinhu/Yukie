//const { message } = require('./message')

module.exports = (error, yukie) => {
   //console.log(message)
   yukie.errors = error;
   console.error(error);
}
