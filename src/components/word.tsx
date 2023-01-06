import {useEffect, useState} from "react"
import {Text, Center} from "@chakra-ui/react"
import randomWords from "random-words"
import "./typing.css"


interface WordProp {
	letters: string
	input: string
	isTyping: boolean
}

interface WordListProp {
	onEnd: () => void
	onStart: () => void
}

export default function WordList(props: WordListProp) {
	const [currentWordIndex, setCurrentWordIndex] = useState(0)
	const [wordList, setWordList] = useState<WordProp[]>([])
	const [wordCount, setWordCount] = useState(10)
	const [startTyping, setStartTyping] = useState(false)
	const [endTyping, setEndTyping] = useState(false)
	const [nextWordList, setNextWordList] = useState(randomWords(wordCount))
	function init() {
		let newWordList = nextWordList.map(val => {
			return {letters: val, input: "", isTyping: false} as WordProp
		})
		setWordList(newWordList)
		setNextWordList(randomWords(wordCount))
		setCurrentWordIndex(0)
		setStartTyping(false)
		setEndTyping(false)
	}
	function reset() {
		init()
		console.log("reset")
		// might add more lines here
	}
	useEffect(() => {
		init()
	}, [])
	function appendWord(e: KeyboardEvent) {
		if (!startTyping && !endTyping) {
			props.onStart()
			setStartTyping(true)
		}
		if (isAlphanum(e.key)) {
			let inputs = wordList.slice()
			inputs[currentWordIndex].input += e.key
			setWordList(inputs)
		}
	}
	function modifyWord(e: KeyboardEvent) {
		if (e.code === "Enter") {
			console.log("enter")
			if (endTyping) {
				reset()
				setEndTyping(false)
			}
		}
		if (endTyping) {
			return
		}
		if (e.key === "Backspace") {
			let inputs = wordList.slice()
			if (inputs[currentWordIndex].input.length === 0) {
				setCurrentWordIndex(Math.max(0, currentWordIndex - 1))
				return
			}
			inputs[currentWordIndex].input = inputs[currentWordIndex].input.slice(0, -1)
			setWordList(inputs)
			return
		}

		if (e.code === "Space") {
			if (currentWordIndex + 1 === wordList.length) {
				setCurrentWordIndex(currentWordIndex + 1)
				props.onEnd()
				setEndTyping(true)
				setStartTyping(false)
				return
			}
			setCurrentWordIndex((currentWordIndex + 1) % wordList.length)
		}


	}
	useEffect(() => {
		window.addEventListener("keypress", appendWord)
		window.addEventListener("keydown", modifyWord)
		return () => {
			window.removeEventListener("keypress", appendWord)
			window.removeEventListener("keydown", modifyWord)
		}
	}, [appendWord, modifyWord])
	let wordElements = wordList.map((val, index) => {
		let isCurrent = currentWordIndex == index
		return (<Word key={index} isTyping={isCurrent} letters={val.letters} input={val.input} />)
	})
	let pastWords: JSX.Element[] = []
	let currentWord: JSX.Element[] = []
	let laterWords: JSX.Element[] = []
	wordElements.forEach((el, index) => {
		if (index === currentWordIndex) {
			currentWord.push(el)
			return
		}
		if (index < currentWordIndex) {
			pastWords.push(el)
			return
		}
		laterWords.push(el)
	})
	return (
		<>
			<div className="pastWords">
				<Center gap={"12px"}>
					{pastWords}
				</Center>
			</div>
			<div className="laterWord">
				<Center gap={"12px"}>
					{laterWords}
				</Center>
			</div>
			<Center width={"100%"} height="800px">
				<div className="currentWord">
					{currentWord}
				</div>
				{currentWord.length === 0 ? (<Text className="retryText">Press ENTER to restart</Text>) : ""}
			</Center>
		</>
	)
}


function Word(props: WordProp) {

	const [word, setWord] = useState("")

	useEffect(() => {
		setWord(props.letters)
	}, [props.letters])

	function wordHandle() {
		return (
			word.split("").map((key, index) => {
				let className = ""
				if (index == props.input.length) {
					if (props.isTyping) {
						className = "currentLetter"
					}
					else {
						className = "laterLetter"
					}
				}
				else if (index > props.input.length) {
					className = "laterLetter"
				}
				else if (key === props.input.charAt(index)) {
					className = "correctLetter"
				}
				else {
					className = "wrongLetter"
				}

				return (
					<a key={index} className={className}>{key}</a>
				)
			})
		)
	}
	useEffect(() => {
	}, [props.input])

	let fontSize = props.isTyping ? "150px" : "40px"
	let currentWordAnimation = props.isTyping ? "currentWordMoveIn" : ""
	return (<Text fontSize={fontSize} className={currentWordAnimation}> {(wordHandle())} </Text>)
}

function isAlphanum(e: string) {
	return /^[a-z0-9]$/i.test(e)
}
