import {useState, useEffect, useImperativeHandle} from "react"
import React from "react"
import {Text} from "@chakra-ui/react"
import "./Timer.css"
export interface TimerPropsType {
	startTimer: () => void
	endTimer: () => void
	resetTimer: () => void
}
const Timer = React.forwardRef((_, ref: React.Ref<TimerPropsType>) => {
	const [startTime, setStartTime] = useState<number | null>(null)
	const [endTime, setEndTime] = useState<number | null>(null)
	const [isStart, setStarted] = useState(false)
	function startTimer() {
		setStartTime(Date.now())
		setEndTime(null)
		setStarted(true)
	}
	function endTimer() {
		if (!isStart) {
			return
		}
		setEndTime(Date.now())
		setStarted(false)
	}
	function resetTimer() {
		setStartTime(null)
		setStarted(false)
	}
	useImperativeHandle(ref, () => {
		return {
			startTimer: startTimer,
			endTimer: endTimer,
			resetTimer: resetTimer
		}
	})

	useEffect(() => {
		let interval: number | null = 0
		if (isStart) interval = setInterval(() => setEndTime(Date.now()), 50)
		return () => {
			if (isStart) clearInterval(interval!)
		}
	})
	let timer = ""
	if (startTime) {
		const currentTime = new Date((endTime ? endTime : Date.now()) - startTime)
		const hours = currentTime.getHours() - 8
		const minutes = currentTime.getMinutes()
		const seconds = currentTime.getSeconds()
		const milliSeconds = Math.floor(currentTime.getMilliseconds() / 10)
		if (hours) timer += hours.toString() + ":"
		if (hours || minutes) timer += minutes.toString() + ":"
		timer += seconds.toString() + "."
		timer += milliSeconds.toString()
	}
	return (
		<Text className={"timer"} fontSize="60px">
			{timer}
		</Text>
	)
})

export default Timer
