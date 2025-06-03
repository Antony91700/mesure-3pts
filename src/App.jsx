import React, { useRef, useState } from 'react'
import { ChakraProvider, Box, Button, Container, Heading, Input, VStack, Text } from '@chakra-ui/react'

function App() {
  const [image, setImage] = useState(null)
  const [points, setPoints] = useState([])
  const [distances, setDistances] = useState([])
  const canvasRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleCanvasClick = (event) => {
    if (points.length >= 3) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newPoints = [...points, { x, y }]
    setPoints(newPoints)

    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = 'red'
    ctx.fill()

    if (newPoints.length === 3) {
      calculateDistances(newPoints)
    }
  }

  const calculateDistances = (points) => {
    const distances = []
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length
      const dx = points[i].x - points[j].x
      const dy = points[i].y - points[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      distances.push(Math.round(distance))
    }
    setDistances(distances)
  }

  const resetMeasurements = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    if (image) {
      ctx.drawImage(image, 0, 0)
    }
    setPoints([])
    setDistances([])
  }

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={10}>
        <VStack spacing={6}>
          <Heading as="h1" size="xl">
            Outil de Mesure d'Image
          </Heading>
          
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            variant="filled"
          />

          <Box border="2px" borderColor="gray.200" borderRadius="md">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{ maxWidth: '100%', cursor: 'crosshair' }}
            />
          </Box>

          {distances.length > 0 && (
            <VStack>
              <Text>Distances (en pixels):</Text>
              {distances.map((distance, index) => (
                <Text key={index}>Point {index + 1} à {(index + 2) > 3 ? 1 : index + 2}: {distance}</Text>
              ))}
            </VStack>
          )}

          <Button
            colorScheme="blue"
            onClick={resetMeasurements}
            isDisabled={points.length === 0}
          >
            Réinitialiser
          </Button>
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App