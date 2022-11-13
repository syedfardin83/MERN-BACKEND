const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser.js');
const { body, validationResult } = require('express-validator');

const Notes = require('../models/Notes.js');

// Route 1: To fetch all notes GET 'api/notes/fetchallnotes' Login required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occcured");
    }
});

// Route 2: To add a new note POST 'api/notes/addnote'. Login required.
router.post('/addnote', [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 3 }),
], fetchuser, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();

        res.json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occcured");
    }
});

// Route 3: To update an exsisting note PUT 'api/notes/updatenote'. Login required.
router.put('/updatenote/:id', fetchuser, async (req,res)=>{
    try{
        const {title, description, tag} = req.body;
        const newNote = {};
        if(title) newNote.title = title;
        if(description) newNote.description = description;
        if(tag) newNote.tag = tag;
    
        var note = await Notes.findById(req.params.id);
        if(!note) res.status(404).send('Not found');
    
        if(note.user.toString() !== req.user.id) res.status(401).send('Not allowed');
    
        note = await Notes.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true});
        // console.log(typeof(note));
        res.json({note});
    }    catch(error){
        console.error(error);
        res.status(500).send("Some error occcured");
    }
});

// Route 4: To delete an exsisting note DELETE 'api/notes/deletenote'. Login required.
router.delete('/deletenote/:id',fetchuser, async(req,res)=>{
    try{
        var note = await Notes.findById(req.params.id);
        if(!note) res.status(404).send('Not found');
    
        if(note.user.toString() !== req.user.id) res.status(401).send('Not allowed');

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Delete successfull","note":note});
    }    catch(error){
        console.error(error);
        res.status(500).send("Some error occcured");
    }
});

module.exports = router;