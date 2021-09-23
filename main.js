const startBtn = document.querySelector("#start-btn")
const nextBtn = document.querySelector("#next-btn")
const containerStart = document.querySelector("#container-start")
const questionContainerElement = document.querySelector("#question-container")
const questionElement = document.querySelector("#question")
const answerBtnElement = document.querySelector("#answer-buttons")
const progressText = document.querySelector("#progressText")
const progressBarFull = document.querySelector("#progressBarFull")
const scoreElement = document.querySelector("#score")

let shuffleQuestions, currenctQuestionIndex

let score = 0
let questionCounter = 0

const MAX_QUESTIONS = 10
const SCORE_POINTS = 10

startBtn.addEventListener("click", startGame)
nextBtn.addEventListener("click", () => {
  currenctQuestionIndex++
  setNextQuestion()
})

function startGame() {
  containerStart.classList.add('hide')
  //sorting an array in random order
  shuffleQuestions = questions[0].sort(() => Math.random() - .5)
  //currentQuestionIndex determines array index
  currenctQuestionIndex = 0
  //progress bar
  questionCounter = 0
  score = 0
  scoreElement.innerText = score
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  //without currenQuestion shows undefined
  showQuestion(shuffleQuestions[currenctQuestionIndex])
}

function showQuestion(question) {
  if(questionCounter >= MAX_QUESTIONS){
    localStorage.setItem('mostRecentScore', score)

    return window.location.assign('/EndGame/end.html')
  }
  //get array of incorrect_answer
  const answersArray = question.incorrect_answers
  //get correct answer
  const correctAnswer = question.correct_answer
  //add correct answer into array of incorrect_answer with random position
  if(!answersArray.includes(correctAnswer)){
    answersArray.splice(Math.random() * 3, 0, correctAnswer)
  }

  questionElement.innerHTML = `<span>${question.category}</span> - ${question.question}`
  //for each answer add a button
  question.incorrect_answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer
    button.classList.add('btn-answer')
    //setData to the correct answer
    if( answer === correctAnswer) {
      //button receives data-correct with the value true
      button.dataset.correct = true
    }
    button.addEventListener('click', selectAnswer)
    answerBtnElement.appendChild(button)
  });
  //progress BAR
  questionCounter++
  progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
  progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}% `
}

//remove previous answers
function resetState() {
  //hide the next button until the person chooses an answer
  nextBtn.classList.add('hide')
  while(answerBtnElement.firstChild){
    answerBtnElement.removeChild(answerBtnElement.firstChild)
  }
}

function selectAnswer(e) {
  //select each button
  const selectedButton = e.target
  //select the button with the correct date
  const selectedAnswer = selectedButton.dataset['correct']
  if(selectedAnswer){
    incrementScore(SCORE_POINTS)
  }

  Array.from(answerBtnElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  //hide next button if questions run out and show the button finish
  if(shuffleQuestions.length > currenctQuestionIndex + 1){
    nextBtn.classList.remove("hide")
  }else {
    const btn = document.createElement('button')
    btn.innerText = 'Finish'
    const controlDiv =document.querySelector(".controls")
    btn.classList.add('btn-finish')   
    btn.addEventListener('click', endGame)
    controlDiv.appendChild(btn)
  }
}

function endGame(){
  questionContainerElement.classList.add('hide')
  //the first condition will happen when this function is called.
  setNextQuestion()
}

function setStatusClass(element, correct){
  clearStatusClass(element)
  correct ? element.classList.add('correct') : element.classList.add('wrong')
}

function clearStatusClass(element){
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

incrementScore = num => {
  score +=num
  scoreElement.innerText = score
}

const questions = []

async function getTriviaApi(){
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    const data = await response.json()
    questions.push(data.results)
  } catch (error) {
    questionContainerElement.innerHTML = "<p>Something went wrong!</p>"
  }
}

getTriviaApi()

