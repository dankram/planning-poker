import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createRoom } from './graphql/mutations'
import { useHistory } from 'react-router-dom'
import 'animate.css'
import s from './styles/createRoom.module.scss'

const CreateRoom = () => {
  const history = useHistory()

  const handleCreateRoom = async () => {
    const createRoomInput = {
      input: {
        flipped: false,
        votes: []
      }
    }

    const result = await API.graphql(
      graphqlOperation(createRoom, createRoomInput)
    )

    history.push(`/${result.data.createRoom.id}`)
  }

  return (
    <div className={s.createRoom}>
      <div className={`${s.inner} animated fadeIn delay-1s slow`}>
        <h1 className={s.planningPoker}>
          <span className={s.thin}>Planning</span>Poker
        </h1>
        <div className={s.logoStreak}>
          <div className={s.logo} />
        </div>
        <div className={s.center}>
          &#9670;
          <button className={s.button} onClick={handleCreateRoom}>
            Create Room
          </button>
          &#9670;
        </div>
      </div>
    </div>
  )
}

export default CreateRoom
