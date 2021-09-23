const userName = document.querySelector('#username')
const saveScoreBtn = document.querySelector('#save-score')
const finalScore = document.querySelector('#final-score')
const mostRecentScore = localStorage.getItem('mostRecentScore')

const highScores = JSON.parse(localStorage.getItem('highScores')) || []

const MAX_HIGH_SCORES = 5

finalScore.innerText = mostRecentScore

userName.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !userName.value
})

saveHighScore = e => {
    e.preventDefault()
    console.log('clicked')
    const score = {
        score: mostRecentScore,
        name: userName.value
    }

    highScores.push(score)

    highScores.sort((a, b) => {
        return b.score - a.score
    })

    highScores.splice(5)

    localStorage.setItem('highScores', JSON.stringify(highScores))
    return window.location.assign('/index.html')
}