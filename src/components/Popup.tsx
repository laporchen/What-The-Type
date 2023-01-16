import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Box,
	HStack
} from '@chakra-ui/react'
import {
	useDisclosure,
	useRadio,
	useRadioGroup
} from '@chakra-ui/react'
import type {UseRadioProps} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import type {Setting} from './types'

import "./Popup.css"


interface PopupPropType {
	onSettingChange: (newSetting: Setting) => void
}

export default function Popup(props: PopupPropType) {
	const {isOpen, onOpen, onClose} = useDisclosure()
	const [setting, setSetting] = useState<Setting>({wordCount: 10})
	useEffect(() => {
		function escClick(key: KeyboardEvent) {
			if (key.code == "Escape") {
				onOpen()
			}
		}
		window.addEventListener("keydown", escClick)
		return () => {
			window.removeEventListener("keydown", escClick)
		}
	}, [])

	function updateWord(newVal: number | string) {
		let settingCopy = JSON.parse(JSON.stringify(setting))
		if (typeof newVal === "string") {
			settingCopy.wordCount = parseInt(newVal)
		}
		else {
			settingCopy.wordCount = newVal
		}
		setSetting(settingCopy)
		return
	}

	useEffect(() => {
		props.onSettingChange(setting)
	}, [setting])

	const wordCountOptions = ["10", "30", "50"]
	const {getRootProps, getRadioProps} = useRadioGroup({
		name: 'WordCount',
		defaultValue: "10",
		onChange: updateWord
	})
	const group = getRootProps()
	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				onEsc={() => {onClose}}
			>
				<ModalOverlay backdropFilter={"blur(12px); hue-rotate(45);"} />
				<ModalContent className="popup" >
					<ModalHeader>Setting</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						Number of words
						<HStack {...group}>
							{
								wordCountOptions.map((value) => {
									const radio = getRadioProps({value})
									return (
										<RadioButton key={value} {...radio}>
											{value}
										</RadioButton>
									)
								})
							}
						</HStack>
					</ModalBody>

					<ModalFooter>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}


function RadioButton(props: UseRadioProps & {children?: string}) {
	const {getInputProps, getCheckboxProps} = useRadio(props as UseRadioProps)

	const input = getInputProps()
	const checkbox = getCheckboxProps()

	return (
		<Box as="label">
			<input {...input} />
			<Box
				{...checkbox}
				cursor="pointer"
				borderWidth="1px"
				borderRadius="md"
				boxShadow="md"
				_checked={{
					bg: "blue.600",
					color: "white",
					borderColor: "gray.600",
				}}
				px={5}
				py={3}
			>
				{props.children}
			</Box>
		</Box >
	)

}
