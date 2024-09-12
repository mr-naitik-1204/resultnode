const express = require('express');
const app = express();
const ejs = require('ejs');


function calculateResults(marks) {
    const { gujrati, hindi, english, science, sanskrut } = marks;

    const total = gujrati + hindi + english + science + sanskrut;
    const per = total / 5;

    let grade;
    if (per >= 95) grade = "A+";
    else if (per >= 85) grade = "A";
    else if (per >= 75) grade = "B+";
    else if (per >= 65) grade = "B";
    else if (per >= 55) grade = "C+";
    else if (per >= 45) grade = "C";
    else grade = "Fail";

    const countBelow33 = [gujrati, hindi, english, science, sanskrut].filter(mark => mark < 33).length;
    let result;
    if (countBelow33 === 0) result = "Pass";
    else if (countBelow33 <= 2) result = "ATKT";
    else result = "Fail";

    return {
        total,
        percentage: per,
        grade,
        result
    };
}

app.set('view engine', 'ejs');

let storedata = [];
let index = null;
let editdata = null;


app.get('/', (req, res) => {
    res.render('index', { data: storedata, editdata: editdata });
});


app.get('/createdata', (req, res) => {
    if (index !== null) {
        storedata[index] = req.query;
        index = null;
        editdata = null;
    } else {
        const marks = {
            name: req.query.name,
            gujrati: parseInt(req.query.gujrati, 10),
            hindi: parseInt(req.query.hindi, 10),
            english: parseInt(req.query.english, 10),
            science: parseInt(req.query.science, 10),
            sanskrut: parseInt(req.query.sanskrut, 10),
        };
        const results = calculateResults(marks);
        req.query = { ...req.query, ...results };
        storedata.push(req.query);
    }
    res.redirect('/');
});


app.get('/deletedata', (req, res) => {
    storedata.splice(req.query.delet, 1);
    res.redirect('/');
});


app.get('/updetedata', (req, res) => {
    index = parseInt(req.query.updete, 10);
    editdata = storedata[index];
    res.render('index', { editdata: editdata, data: storedata });
});


app.listen(5002);
