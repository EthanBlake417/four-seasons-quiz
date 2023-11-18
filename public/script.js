document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
});

function loadQuestions() {
    fetch('/questions')
        .then((response) => {
            return response.json();
        })
        .then((questions) => {
            displayQuestions(questions);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


let userAnswers = {};
let currentQuestionIndex = 0;

function displayQuestions(questions) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; // Clear existing content

    function displayCurrentQuestion() {
        if (currentQuestionIndex >= questions.length) {
            if (!document.querySelector('.submit-button')) { // Check if submit button already exists
                showSubmitButton();
            }
            return;
        }

        const question = questions[currentQuestionIndex];
        container.innerHTML = '';

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionText = document.createElement('h1');
        questionText.textContent = question.question;
        questionDiv.appendChild(questionText);

        const choicesDiv = document.createElement('div');
        choicesDiv.classList.add('choices-container');

        question.choices.forEach((choice, index) => {
            const choiceLabel = document.createElement('label');
            choiceLabel.classList.add('choice');

            const choiceCaption = document.createElement('span');
            choiceCaption.textContent = choice.answer;
            choiceCaption.classList.add('choice-caption');
            choiceLabel.appendChild(choiceCaption);

            const choiceRadio = document.createElement('input');
            choiceRadio.setAttribute('type', 'radio');
            choiceRadio.setAttribute('name', 'questionChoice');
            choiceRadio.setAttribute('value', choice.season);
            choiceRadio.classList.add('choice-radio');

            const choiceImage = document.createElement('img');
            choiceImage.src = choice.img_path; // Use img_path from JSON
            choiceImage.classList.add('choice-image');

            choiceRadio.addEventListener('change', () => {
                userAnswers[currentQuestionIndex] = choice.season;
                currentQuestionIndex++;
                setTimeout(displayCurrentQuestion, 5);
            });

            choiceLabel.appendChild(choiceRadio);
            choiceLabel.appendChild(choiceImage);
            choicesDiv.appendChild(choiceLabel);
        });

        questionDiv.appendChild(choicesDiv);
        container.appendChild(questionDiv);
    }

    displayCurrentQuestion();
}

function showSubmitButton() {
    const container = document.getElementById('quiz-container');
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submit-button');
    submitButton.addEventListener('click', submitQuiz);
    container.appendChild(submitButton);
}

function submitQuiz() {
    let scores = { "Spring": 0, "Summer": 0, "Autumn": 0, "Winter": 0 };

    for (let answer of Object.values(userAnswers)) {
        if (scores.hasOwnProperty(answer)) {
            scores[answer]++;
        }
    }

    fetch('/result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scores),
    })
    .then(response => response.json())
    .then(resultData => {
        displayResult(resultData);
    })
    .catch(error => console.error('Error:', error));
}




function submitAnswers(answers) {
    fetch('/result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
    })
    .then(response => response.json())
    .then(result => {
        displayResult(result);
    })
    .catch(error => console.error('Error:', error));
}

function displayResult(resultData) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');

    const resultImage = document.createElement('img');
    resultImage.src = 'images/four_seasons.jpg'; // Path to your image
    resultImage.classList.add('result-image');
    resultDiv.appendChild(resultImage);

    const resultHeader = document.createElement('h2');
    resultHeader.textContent = `Congratulations! You are the ${resultData.result} movement of Vivaldi's Four Seasons.`;
    resultDiv.appendChild(resultHeader);

    const resultDescription = document.createElement('p');
    resultDescription.textContent = resultData.description;
    resultDiv.appendChild(resultDescription);

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Take the Quiz Again';
    restartButton.classList.add('restart-button');
    restartButton.addEventListener('click', () => {
        location.reload(); // Reloads the page from the beginning
    });
    resultDiv.appendChild(restartButton);

    container.appendChild(resultDiv);
}


