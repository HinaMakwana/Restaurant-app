/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
 const dotenv = require('dotenv').config()
 const bcrypt = require('bcrypt');


module.exports.bootstrap = async function() {
  const id = sails.config.custom.uuid
  const {role} = sails.config.common
  const pass = await bcrypt.hash('admin', 10)

  const findUser = await User.findOne({ role : 'admin' })
  if(!findUser){
    const createUser = await User.createEach([
      { id : id(), name : 'admin1', mobileNo : 9898365241, address : 'bhavnagar',email: 'admin1@gmail.com', password: pass, role : role.admin},
    ])
  }
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

};
