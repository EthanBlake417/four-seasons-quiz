const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/questions', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'questions.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading questions file');
            return;
        }
        let questions = JSON.parse(data);
        questions.forEach(question => {
            question.choices = question.choices.sort(() => Math.random() - 0.5);
        });
        res.json(questions.sort(() => Math.random() - 0.5));
    });
});

app.post('/result', (req, res) => {
    const userScores = req.body;
    console.log("User Scores:", userScores); // Log user scores

    fs.readFile(path.join(__dirname, 'data', 'answers.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading answers file:', err);
            res.status(500).send('Error reading answers file');
            return;
        }
        let descriptions = JSON.parse(data);
        let result = calculateResult(userScores);
        console.log("Calculated Result:", result); // Log calculated result

        if (!descriptions[result]) {
            console.error('Result not found in descriptions:', result);
            res.status(500).send('Result not found in descriptions');
            return;
        }

        res.json({ result: result, description: descriptions[result].description });
    });
});


function calculateResult(scores) {
    let maxScore = -1;
    let resultSeason = '';

    for (const [season, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            resultSeason = season;
        }
    }

    return resultSeason;
}




app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
