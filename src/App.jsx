import React from 'react'
import { ChakraProvider, Box, Heading, Container } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={10}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={6}>
            Bienvenue sur notre application
          </Heading>
        </Box>
      </Container>
    </ChakraProvider>
  )
}

export default App