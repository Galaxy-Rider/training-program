import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TrainingProgram from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TrainingProgram />
  </StrictMode>
)
