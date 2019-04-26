/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // action - create
    create: async function (req, res) {

        if (req.method == "GET")
            return res.view('person/create');

        if (typeof req.body.Person === "undefined")
            return res.badRequest("Form-data not received.");

        req.body.Person.EventDate = new Date( req.body.Person.EventDate);
        await Person.create(req.body.Person);

        return res.ok("Successfully created!");
    },

    // action - index
    index: async function (req, res) {

        
        const qRole = req.session.role || "visitor";
        const qID = parseInt(req.session.uid) || -1;

  

        if (qRole == "student") {
           
           
            var persons = await User.findOne(qID).populate("regi");


            return res.view('person/index', { 'persons': persons.regi});
        } else {
            var persons = await Person.find({
                where: { Box: 'Highlighted' },
                limit: 10,
            }).exec(function (err, highlightedArray) {
                
                return res.view('person/index', { 'persons': highlightedArray});
            });
        }

        

        // var persons = await Person.find({
        //     where: { Venue: 'AAB201' }
        // });
        // var persons2 = await Person.find({
        //     where: { Venue: 'OEE601' }
        // });
        // var persons3 = await Person.find({
        //     where: { Venue: 'SWT501' }
        // });
        // var persons4 = await Person.find({
        //     where: { Venue: 'FSC501' }
        // });



        // return res.view('person/index', { 'persons1': persons, 'persons2': persons2,'persons3': persons3,'persons4': persons4 });

    },

    /// action - view
    view: async function (req, res) {

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await Person.findOne(req.params.id);


        if (!model) return res.notFound();

        return res.view('person/view', { 'person': model });

    },


    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var models = await Person.destroy(req.params.id).fetch();

        if (models.length == 0) return res.notFound();

        //return res.redirect('/person/admin');
        return res.ok("Event Deleted.");

    },



    // action - update
    update: async function (req, res) {

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (req.method == "GET") {

            var model = await Person.findOne(req.params.id);

            if (!model) return res.notFound();

           

            return res.view('person/update', { 'person': model });

        } else {

            if (typeof req.body.Person === "undefined")
                return res.badRequest("Form-data not received.");

            if (typeof req.body.Person.Box === "undefined")
                req.body.Person.Box === "unchecked";

                
 
            var models = await Person.update(req.params.id).set({
                EventName: req.body.Person.EventName,
                ShortDescription: req.body.Person.ShortDescription,
                FullDescription: req.body.Person.FullDescription,
                IamgeURL: req.body.Person.IamgeURL,
                Origanizer: req.body.Person.Origanizer,
                EventDate:  new Date( req.body.Person.EventDate) ,
                Time: req.body.Person.Time,
                Venue: req.body.Person.Venue,
                Box: req.body.Person.Box,
            }).fetch();

            if (models.length == 0) return res.notFound();

            return res.ok("Record updated");

        }
    },

    /// search function
    search: async function (req, res) {
        // const qPage = Math.max(req.query.page - 1, 0) || 0;
        // const numOfItemsPerPage = 2;
    

        // const qeName = req.query.eName || "";
        // //const qVenue = parseInt(req.query.age);
        // const qVenue = req.query.venue || "";
        // const qOrg = req.query.eOrg || "";
        // const qsDate = new Date(req.query.sDate) || new Date("01/01/1990");
        // const qeDate = new Date(req.query.eDate) || new Date("12/31/2099");

        // var rParam = "eName=" + qeName + "&venue=" + qVenue + "&sDate=" + req.query.sDate + "&eDate=" + req.query.eDate;
        
      

        //     var eList = await Person.find({
        //         where: { EventName: { contains: qeName }, Origanizer: { contains: qOrg },Venue: { contains: qVenue } , EventDate: {">=": qsDate, "<=": qeDate}},
        //         sort: 'EventName',
        //         limit: numOfItemsPerPage,
        //         skip: numOfItemsPerPage * qPage
        //     });
        //     var eListTotal = await Person.find({
        //         where: { EventName: { contains: qeName }, Origanizer: { contains: qOrg },Venue: { contains: qVenue } , EventDate: {">=": qsDate, "<=": qeDate}},
        //         sort: 'EventName',
        //     });

        //     // console.log("aaa");
        //     // console.log(eList.length);
        //     // console.log(eListTotal.length);


        //     var numOfPage = Math.ceil(await eListTotal.length / numOfItemsPerPage);
    
        // // if (isNaN(qAge)) {
        // //     console.log("guo2");
        // //     var persons = await Person.find({
        // //         where: { EventName: { contains: qName } },
        // //         sort: 'EventName' //can sort to desc "sort : 'name DESC' "
        // //     });

        // // } else {
        // //     console.log("else");
        // //     var persons = await Person.find({
        // //         where: { EventName: { contains: qName }, Venue: qAge },
        // //         sort: 'EventName'
        // //     });

        // // }

        // return res.view('person/search', { 'person': eList, "query": req.query, 'count': numOfPage, "param": rParam });
    },

    // action - paginate
    paginate: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;

        const numOfItemsPerPage = 2;

        var persons = await Person.find({
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        var numOfPage = Math.ceil(await Person.count() / numOfItemsPerPage);

        return res.view('person/paginate', { 'persons': persons, 'count': numOfPage });
    },

    // action - admin
    admin: async function (req, res) {


        var list = await Person.find();

        if (!list) return res.notFound();

        return res.view('person/admin', { 'eList': list });

    },

    populate: async function (req, res) {


        if (!['have'].includes(req.params.association)) return res.notFound();
    
        const message = sails.getInvalidIdMsg(req.params);
    
 
        if (message) return res.badRequest(message);
    
 
        var model = await Person.findOne(req.params.id).populate(req.params.association);
    
 
        if (!model) return res.notFound();


        return res.json(model);
    
    },

};

