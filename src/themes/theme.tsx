import {extendTheme, type ThemeConfig} from '@chakra-ui/react'

const config: ThemeConfig = {
	initialColorMode: 'dark',
	useSystemColorMode: false,
}


const theme = extendTheme(
	{
		styles: {
			global: () => ({
				body: {
					bg: "",
				},
			}),
		}
	}
)

export default theme
