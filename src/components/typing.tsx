import {Center, Box, HStack, Text} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import randomWords from "random-words"
import "./typing.css"

export default function Typing() {
	const [wordList, setWordList] = useState(randomWords(5))
	const [targetIndex, setTargetIndex] = useState(0)
	const [userInputList, setUserInputList] = useState(Array.from({length: wordList.length}, () => ""))
	const [userInputIndex, setUserInputIndex] = useState(0)
	useEffect(() => {
		function appendWord(e: KeyboardEvent) {
			if (isAlphanum(e.key)) {
				let inputs = userInputList.slice()
				inputs[userInputIndex] += e.key
				setUserInputList(inputs)
			}
		}
		function modifyWord(e: KeyboardEvent) {
			if (e.keyCode === 8) {
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

			if (e.keyCode === 32) {
				if (targetIndex + 1 === wordList.length) {
					alert("Done")
					setTargetIndex(0)
					setUserInputIndex(0)
					setWordList(randomWords(5))
					setUserInputList(Array.from({length: wordList.length}, () => ""))
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
		const wordEnd =
			wordList[wordIndex].length === userInputList[userInputIndex].length && wordIndex === userInputIndex
				? "currentLetter" : ""
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
					<a className={className}>{key}</a>
				)
			}).concat([<a className={wordEnd}>&nbsp;</a>])
		)
	}
	const wordsDiv = wordList.map((_, index) => {
		return (<div key={index}>
			<Text fontSize={"3xl"}>
				{(currentWordHandle(index))}
			</Text>
		</div>)
	})
	return (
		<div>
			<Center width={"100%"} height="100%">
				{wordsDiv}
			</Center>
		</div>
	)
}

function isAlphanum(e: string) {
	return /^[a-z0-9]+$/i.test(e)
}
