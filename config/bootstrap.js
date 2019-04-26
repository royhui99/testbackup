

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  sails.getInvalidIdMsg = function (opts) {

    if (opts.id && isNaN(parseInt(opts.id))) {
        return "Primary key specfied is invalid (incorrect type).";
    }
  
    if (opts.fk && isNaN(parseInt(opts.fk))) {
        return "Foreign key specfied is invalid (incorrect type).";
    }
  
    return null;        // falsy
  
  };

  sails.bcrypt = require('bcrypt');
  const saltRounds = 10;

  if (await Person.count() > 0) {
    return done();
  }

  await Person.createEach([


    { EventName: "Game", Time: "11:11", Venue: "AAB201", Quota: 22, Box: "Highlighted", EventDate: new Date("04/30/2019"), Origanizer: "SU", FullDescription: "play Game", IamgeURL: "https://i.ytimg.com/vi/lG2dXobAXLI/maxresdefault.jpg", ShortDescription: "Let's play game together" },
    { EventName: "Talk about Switch", Time: "11:22", Quota: 22, Box: "Highlighted", EventDate: new Date("04/25/2019"), Origanizer: "SA", Venue: "AAB201", IamgeURL: "https://static.gamespot.com/uploads/scale_super/123/1239113/3314780-switchgamegallery.jpg", FullDescription: "talk about Switch game by some professional guest. Please come and join us ", ShortDescription: "A pro gamer is going to talk about how switch is being popular nowadays" },
    { EventName: "Singing Contest", Time: "11:33", Quota: 22, Box: "Highlighted", EventDate: new Date("04/20/2019"), Origanizer: "Student", Venue: "OEE601", IamgeURL: "https://pbs.twimg.com/profile_images/476209194660397057/17Db_NHB.jpeg", FullDescription: "singing with frds. you can choose singing personally and singing with frds. both have some gifts for you.", ShortDescription: "2018 HKBU Singing Contest will be held on 10TH october. Let's come to join and sing!" },
    { EventName: "BBQ for the freshman", Time: "11:44",  Quota: 22,Box: "Highlighted", EventDate: new Date("04/15/2019"), Venue: "OEE601", Origanizer: "SA", IamgeURL: "https://thekensingtonwhiteplains.com/wp-content/uploads/grilling-2491123_960_720.jpg", FullDescription: "BBQ with frds.", ShortDescription: "Computer Society is holding a BBQ for this year freshman. Let's come to meet some new friends." }

    // //etc.


  ]);

  const hash = await sails.bcrypt.hash('123456', saltRounds);

  await User.createEach([
    { "username": "admin", "password": hash, "role": "admin" },
    { "username": "tom", "password": hash , "role": "student" },
    { "username": "jerry", "password": hash , "role": "student"},
    { "username": "dog", "password": hash , "role": "student"}
    // etc.
  ]);


  const Game = await Person.findOne({ EventName: "Game" });
  const TA = await Person.findOne({ EventName: "Talk about Switch" });


  // const admin = await User.findOne({ username: "admin" });
  const tom = await User.findOne({ username: "tom" });
  const jerry = await User.findOne({ username: "jerry" });
  const dog = await User.findOne({ username: "dog" });

  await User.addToCollection(tom.id, 'regi').members([Game.id, TA.id]);
  await User.addToCollection(jerry.id, 'regi').members([Game.id]);






  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
