import {Center} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import Timer from "./Timer"
import {TimerPropsType} from "./Timer"
import "./typing.css"
import WordList from "./word"


export default function Typing() {
	const [isStart, setStart] = useState(false)
	const timerRef = React.createRef<TimerPropsType>()
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
	return (
		<div className="main">
			<WordList onStart={() => init()} onEnd={() => end()} />
			<Timer ref={timerRef} />
		</div>
	)
}

