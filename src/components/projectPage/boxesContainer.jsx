/* eslint-disable react/jsx-key */
// React imports
import React, { useState, useEffect } from 'react'

// MUI imports
import { Box } from '@mui/material'

// Components imports
import CardBoardBox from './cardBoardBox'
import PopUpCard from '../popUpCard/popUpCard'
import Timer from './timer'

// Style import
import styles from './boxesContainer.module.css'

// Axios import
import axios from 'axios'
import HeaderConstructor from '../../utils/constructors/headerConstructor'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { changeSelectedProject } from '../../redux/slices/projectSlice'

export default function BoxesContainer () {
  const actualProject = useSelector(state => state.projectController.selectedProject)
  let currentTotalCards = 0
  let totalCards = actualProject.completeBox?.length ?? 0

  actualProject.boxes?.forEach(b => {
    totalCards += b.cards.length
    currentTotalCards += b.cards.length
  })

  const dispatch = useDispatch()

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

      dispatch(changeSelectedProject(response.data.body))
    } catch (e) {
      console.error('[Error en la llamada a getProject] ' + e)
    }
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
        <h3>Tarjetas en uso: {currentTotalCards}</h3>
        <h3>Total de tarjetas: {totalCards}</h3>
      </Box>
      <section className={styles.boxContainer}>
        {actualProject.boxes
          ? actualProject.boxes.map((b, i) => {
            const haveCards = b.cards.length !== 0
            return (
              <div key={i}>
                {haveCards && b.isEmpty ? (<article><p className={styles.info}>No hay preguntas disponibles por el momento.</p></article>) : null}
                {!haveCards && b.isEmpty ? (<p className={styles.info}>No hay preguntas en esta caja</p>) : null}
                {!b.isEmpty && (<p className={styles.info}>Preguntas disponibles</p>)}
                <CardBoardBox
                  key={b._id}
                  id={i}
                  getCard={getCard}
                  days={boxDays[i]}
                  open={open}
                  isEmpty={b.isEmpty}
                />
                {(haveCards && b.isEmpty) && (<Timer
                  key={i}
                  deadTime={b.cards[0]?.movedOn || null}
                  getProject={getProject}
                                              />)}
              </div>
            )
          })
          : null}
      </section>
      {(actualCard && actualCard.question)
        ? <PopUpCard
            open={open}
            setOpen={setOpen}
            card={actualCard}
            projectId={projectId}
          />
        : null}
    </Box>
  )
}
