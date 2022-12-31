import {Center, Text} from "@chakra-ui/react"
import React, {useEffect, useRef, useState} from "react"
import randomWords from "random-words"
import Timer from "./Timer"
import {TimerPropsType} from "./Timer"
import "./typing.css"


export default function Typing() {
	const wordCount = 20
	const [wordList, setWordList] = useState(randomWords(wordCount))
	const [targetIndex, setTargetIndex] = useState(0)
	const [userInputList, setUserInputList] = useState(Array.from({length: wordCount}, () => ""))
	const [userInputIndex, setUserInputIndex] = useState(0)
	const [hasStartTyping, setStartTyping] = useState(false)
	const timerRef = React.createRef<TimerPropsType>()
	useEffect(() => {
		function reset() {
			timerRef.current?.resetTimer()
			setStartTyping(false)
			setTargetIndex(0)
			setUserInputIndex(0)
			setWordList(randomWords(wordCount))
			setUserInputList(Array.from({length: wordList.length}, () => ""))
		}
		function appendWord(e: KeyboardEvent) {
			if (isAlphanum(e.key)) {
				let inputs = userInputList.slice()
				inputs[userInputIndex] += e.key
				setUserInputList(inputs)
			}
		}
		function modifyWord(e: KeyboardEvent) {
			if (!hasStartTyping) {
				if (targetIndex + 1 === wordList.length) {
					reset()
				}
				setStartTyping(true)
				timerRef.current?.startTimer()
			}
			if (e.key === "Backspace") {
				let inputs = userInputList.slice()
				if (inputs[userInputIndex].length === 0) {
					setUserInputIndex(Math.max(0, userInputIndex - 1))
					setTargetIndex(Math.max(0, targetIndex - 1))
					return
				}
				inputs[userInputIndex] = inputs[userInputIndex].slice(0, -1)
				setUserInputList(inputs)
				return
			}

			if (e.code === "Space") {
				if (targetIndex + 1 === wordList.length) {
					timerRef.current?.endTimer()
					setStartTyping(false)
					return
				}
				setTargetIndex((targetIndex + 1) % wordList.length)
				setUserInputIndex((userInputIndex + 1) % userInputList.length)
			}

		}
		window.addEventListener("keypress", appendWord)
		window.addEventListener("keydown", modifyWord)
		return () => {
			window.removeEventListener("keypress", appendWord)
			window.removeEventListener("keydown", modifyWord)
		}
	})
	function currentWordHandle(wordIndex: number) {
		return (
			wordList[wordIndex].split("").map((key, index) => {
				let className = ""
				if (index == userInputList[wordIndex].length) {
					if (wordIndex === userInputIndex) {
						className = "currentLetter"
					}
					else {
						className = "laterLetter"
					}
				}
				else if (index > userInputList[wordIndex].length) {
					className = "laterLetter"
				}
				else if (key === userInputList[wordIndex].charAt(index)) {
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
	let pastGridItem: JSX.Element[] = []
	let laterGridItem: JSX.Element[] = []
	let currentGridItem: JSX.Element[] = []
	wordList.forEach((_, index) => {
		let fontSize = index === userInputIndex ? "150px" : "40px"
		let currentWordAnimation = index === userInputIndex ? "currentWordMoveIn" : ""
		let wordItem = (<Text key={index} fontSize={fontSize} className={currentWordAnimation}> {(currentWordHandle(index))} </Text>)
		if (index < userInputIndex) {
			pastGridItem.push(wordItem)
			return
		}
		if (index === userInputIndex) {
			currentGridItem.push(wordItem)
			return
		}
		laterGridItem.push(wordItem)

	})
	return (
		<div className="main">
			<div className="pastWords">
				<Center gap={"12px"}>
					{pastGridItem}
				</Center>
			</div>
			<div className="laterWord">
				<Center gap={"12px"}>
					{laterGridItem}
				</Center>
			</div>
			<Center width={"100%"} height="800px">
				<div className="currentWord">
					{currentGridItem}
				</div>
			</Center>
			<Timer ref={timerRef} />
		</div>
	)
}

function isAlphanum(e: string) {
	return /^[a-z0-9]+$/i.test(e)
}
