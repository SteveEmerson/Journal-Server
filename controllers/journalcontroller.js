const express = require('express');
const router = express.Router();
const validateSession = require('../middleware/validate-session');
const Journal = require('../db.js').import('../models/journal');

router.get('/practice', validateSession, function(req, res){
  res.send('Hey!! This is a practice route.');
});

/* **************************
**** JOURNAL CREATE ****
*************************** */

router.post('/create', validateSession, function(req, res){
  const journalEntry = {
    title: req.body.journal.title,
    date: req.body.journal.date,
    entry: req.body.journal.entry,
    owner: req.user.id
  }
  //console.log(journalEntry);
  Journal.create(journalEntry)
  .then(function createSuccess(journal){
    return res.status(200).json(journal);
  })
  .catch(function createFail(err){
    return res.status(500).json({error: err, message: "you are here dummy"});
  })
});

/* ********************
*** GET ALL ENTRIES ***
********************** */

router.get('/', function(req, res){
  Journal.findAll()
  .then(journals => res.status(200).json(journals))
  .catch(err => res.status(500).json({error: err}))
});

/* ************************
*** GET ENTRIES BY USER ***
************************* */
router.get('/mine', validateSession, function(req, res){
  console.log(req.user);
  Journal.findAll({
    where:{
      owner: req.user.id
    }
  })
  .then(journals => res.status(200).json(journals))
  .catch(err => res.status(500).json({error: err}))
});

/* ************************
*** GET ENTRIES BY TITLE ***
************************* */
router.get('/:title', function(req, res){
  //console.log(req.params)
  Journal.findAll({
    where:{
      title: req.params.title
    }
  })
  .then(journals => res.status(200).json(journals))
  .catch(err => res.status(500).json({error: err}))
});

/* ************************
*** UPDATE AN ENTRY ***
************************* */
router.put('/update/:entryId', validateSession, function(req, res){
  const updateJournalEntry = {
    title: req.body.journal.title,
    date: req.body.journal.date,
    entry: req.body.journal.entry
  }

  const query = {where: {id: req.params.entryId, owner: req.user.id} };

  Journal.update(updateJournalEntry, query)
  .then(journals => res.status(200).json(journals))
  .catch(err => res.status(500).json({error: err}))
});

/* ************************
*** DELETE AN ENTRY ***
************************* */
router.delete('/delete/:id', validateSession, function(req, res){

  Journal.destroy({where: {id: req.params.id, owner: req.user.id}})
  .then(journals => res.status(200).json({message: "Journal Entry Removed"}))
  .catch(err => res.status(500).json({error: err}))
});

module.exports = router;