import React, {useState, useEffect} from "react"
import {HStack, Text} from "@chakra-ui/react"
import Timer from "./Timer"
import {TimerPropsType} from "./Timer"
import "./typing.css"
import WordList from "./word"


export default function Typing() {
	const [isStart, setStart] = useState(false)
	const [wpm, setWpm] = useState(0)
	const [accuracy, setAccuracy] = useState(0)
	const [correctWord, setCorrectWord] = useState(0)
	const [finishedWord, setFinishedWord] = useState(0)
	const timerRef = React.createRef<TimerPropsType>()
	function calculateTypingStat(): void {
		console.log("calculateWpm", correctWord)
		if (!timerRef.current?.durationInSecond) {
			setWpm(0)
			setAccuracy(0)
			return
		}
		setWpm(finishedWord * 60 / timerRef.current.durationInSecond)
		if (finishedWord) setAccuracy((correctWord / finishedWord) * 100)
		return
	}
	function init() {
		if (isStart) return
		console.log("init")
		timerRef.current?.resetTimer()
		timerRef.current?.startTimer()
		setStart(true)
	}
	function end() {
		console.log("end")
		timerRef.current?.endTimer()
		setStart(false)
	}

	useEffect(() => {
		let interval: number | null = 0
		if (isStart) interval = setInterval(() => {calculateTypingStat()}, 50)
		return () => {
			if (isStart) clearInterval(interval!)
		}
	})
	return (
		<div className="main">
			<WordList onStart={() => init()} onEnd={() => end()}
				setWordComplete={(correct, finished) => {setCorrectWord(correct); setFinishedWord(finished)}} />
			<HStack justify={"center"} spacing="36px">
				<Text className="wpm" fontSize={"3xl"}> WPM : {wpm.toFixed(2)}</Text>
				<Text className="wpm" fontSize={"3xl"}> Accuracy : {accuracy.toFixed(2)}%</Text>
				<Text className="wpm" fontSize={"3xl"}> Modified WPM : {(wpm * accuracy / 100).toFixed(2)}</Text>
			</HStack>
			<Timer ref={timerRef} />
		</div >
	)
}

