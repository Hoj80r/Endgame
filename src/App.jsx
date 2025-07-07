import { useState } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"

export default function AssemblyEndgame() {
  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived values
  const numGuessesLeft = languages.length - 1
  const wrongGuessCount =
      guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon =
      currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  //check the guessed letter
  function addGuessedLetter(letter) {
      setGuessedLetters(prevLetters =>
          prevLetters.includes(letter) ?
              prevLetters :
              [...prevLetters, letter]
      )
  }

  //render language chips
  const languageElements = languages.map((lang, index) => {
      const isLanguageLost = index < wrongGuessCount
      const styles = {
          backgroundColor: lang.backgroundColor,
          color: lang.color
      }
      const className = clsx("chip", isLanguageLost && "lost")
      return (
          <span
              className={className}
              style={styles}
              key={lang.name}
          >
              {lang.name}
          </span>
      )
  })

  //render word letters
  const letterElements = currentWord.split("").map((letter, index) =>
    { 
      const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    }
  )

  //render keyboard
  const keyboardElements = alphabet.split("").map(letter => {
      const isGuessed = guessedLetters.includes(letter)
      const isCorrect = isGuessed && currentWord.includes(letter)
      const isWrong = isGuessed && !currentWord.includes(letter)
      const className = clsx({
          correct: isCorrect,
          wrong: isWrong
      })

      return (
          <button
              className={className}
              key={letter}
              disabled={isGameOver}
              aria-disabled={guessedLetters.includes(letter)}
              aria-label={`Letter ${letter}`}
              onClick={() => addGuessedLetter(letter)}
          >
              {letter.toUpperCase()}
          </button>
      )
  })

  //set class names for game status
  const gameStatusClass = clsx("game-status", {
      won: isGameWon,
      lost: isGameLost,
      farewell: !isGameOver && isLastGuessIncorrect
  })

  //star a new game
  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  //render game status
  function renderGameStatus() {
      if (!isGameOver && isLastGuessIncorrect) {
          return (
              <p className="farewell-message">
                  {getFarewellText(languages[wrongGuessCount - 1].name)}
              </p>
          )
      }

      if (isGameWon) {
          return (
              <>
                  <h2>You win!</h2>
                  <p>Well done! 🎉</p>
              </>
          )
      } 
      if (isGameLost) {
          return (
              <>
                  <h2>Game over!</h2>
                  <p>You lose! Better start learning Assembly 😭</p>
              </>
          )
      }
      
      return null
  }
  //jsx elements
  return (
    <main>
      <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word within 8 attempts to keep the
          programming world safe from Assembly!</p>
      </header>

      {/* game status */}
      <section 
          aria-live="polite" 
          role="status" 
          className={gameStatusClass}
      >
          {renderGameStatus()}
      </section>

      {/* language chips */}
      <section className="language-chips">
          {languageElements}
      </section>

      {/* the word */}
      <section className="word">
          {letterElements}
      </section>
      
      {/* Combined visually-hidden aria-live region for status updates
      <section 
          className="sr-only" 
          aria-live="polite" 
          role="status"
      >
          <p>
              {currentWord.includes(lastGuessedLetter) ? 
                  `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                  `Sorry, the letter ${lastGuessedLetter} is not in the word.`
              }
              You have {numGuessesLeft} attempts left.
          </p>
          <p>Current word: {currentWord.split("").map(letter => 
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>
      
      </section> */}

      {/* keyboard */}
      <section className="keyboard">
          {keyboardElements}
      </section>
      
      {/* new game btn */}
      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  )
}
