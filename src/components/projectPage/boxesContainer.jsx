// React imports
import React, { useState, useEffect } from 'react'

// MUI imports
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'

// Components imports
import CardBoardBox from './cardBoardBox'

// Style import
import styles from './boxesContainer.module.css'

// Axios import
import axios from 'axios'
import HeaderConstructor from '../../utils/constructors/headerConstructor'
import { useParams } from 'react-router-dom'

export default function BoxesContainer () {
  const [actualProject, setProject] = useState({})

  const boxDays = [
    'preguntas para responder cada dia',
    'preguntas para responder cada 5 dias',
    'preguntas para responder cada 15 dias',
    'preguntas para responder cada 30 dias'
  ]

  const { projectId } = useParams()

  const [actualCard, setCard] = useState({})
  const [open, setOpen] = useState(false)

  const getProject = async () => {
    try {
      const config = HeaderConstructor()

      const response = await axios.get(`/project/${projectId}`, config)
      console.log(response)
      setProject(response.data.body.project)
    } catch (e) {
      console.error('[Error en la llamada a getProject] ' + e)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  async function getCard (boxId) {
    try {
      const config = HeaderConstructor()
      const response = await axios.get(`/random-card?projectId=${projectId}&box=${boxId}`, config)

      setCard(response.data.body.card)
      setOpen(true)
    } catch (e) {
      console.error('[Error en la llamada a getCard] ' + e)
    }
  }

  useEffect(() => {
    getProject()
  }, [])

  return (
    <Box className={styles.high_container}>
      <Box className={styles.projectInfo}>
        <h2>Project: {actualProject.name ?? null}</h2>
        <h3>Tag: {actualProject.tag ? actualProject.tag.name : null}</h3>
      </Box>
      <section className={styles.boxContainer}>
        {actualProject.boxes
          ? actualProject.boxes.map((v, i) => {
            return (
              <CardBoardBox key={v._id} id={i} getCard={getCard} days={boxDays} />
            )
          })
          : null}
      </section>
      {/* CHANGE THIS DIALOG FOR THE REAL ONE */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actualCard.question}
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Email Address'
            type='email'
            fullWidth
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
