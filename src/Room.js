import React, { useState, useEffect } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { addVote, updateRoom } from './graphql/mutations'
import { getRoom } from './graphql/queries'
import { onUpdateRoom } from './graphql/subscriptions'
import { useParams } from 'react-router-dom'
import ColorCard from './ColorCard'
import ReactCardFlip from 'react-card-flip'
import Modal from 'react-modal'
import s from './styles/room.module.scss'
import 'animate.css'

export default () => {
  const { id } = useParams()
  const [name, setName] = useState()
  const [room, setRoom] = useState({ flipped: false, votes: [] })
  const [linkEditable, setLinkEditable] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // const ans = prompt("What's your name?");
    setShowModal(true)

    API.graphql(graphqlOperation(getRoom, { id })).then(result =>
      setRoom(result.data.getRoom)
    )

    API.graphql(graphqlOperation(onUpdateRoom, { id })).subscribe({
      next: evt => setRoom(evt.value.data.onUpdateRoom)
    })
  }, [id])

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '200px',
      textAlign: 'center'
    }
  }

  const handleNameChange = e => {
    setName(e.target.value)
  }

  const handleNameAccept = () => {
    setShowModal(!showModal)
    setLoaded(true)
  }

  const createArray = votes => {
    const numberSet = []

    votes.forEach(person => {
      numberSet.push(person.vote)
    })

    return numberSet
  }

  const average = votes => {
    const numberSet = createArray(votes)

    votes.forEach(person => {
      numberSet.push(person.vote)
    })

    if (numberSet.length > 0) { return Math.round(numberSet.reduce((a, b) => a + b) / numberSet.length) } else return 'N/A'
  }

  const handleVote = vote => () => {
    const addVoteInput = {
      id,
      name,
      vote
    }

    API.graphql(graphqlOperation(addVote, addVoteInput))
  }

  const handleStoryLinkBlur = e => {
    const storyLink = e.currentTarget.value

    if (storyLink) {
      const updateRoomInput = {
        input: {
          id,
          storyLink
        }
      }

      API.graphql(graphqlOperation(updateRoom, updateRoomInput))
    }

    setLinkEditable(false)
  }

  const handleStoryLinkClick = () => setLinkEditable(true)

  const handleURLClick = (e, url) => {
    e.preventDefault()
    window.open(url)
  }

  const flipRoom = () => {
    const updateRoomInput = {
      input: {
        id,
        flipped: true
      }
    }

    API.graphql(graphqlOperation(updateRoom, updateRoomInput))
  }

  const resetRoom = () => {
    const updateRoomInput = {
      input: {
        id,
        flipped: false,
        votes: [],
        storyLink: null
      }
    }

    API.graphql(graphqlOperation(updateRoom, updateRoomInput))
  }

  const getHashCode = str => {
    var hash = 0
    if (str.length === 0) return hash
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
      hash = hash & hash // Convert to 32bit integer
    }
    return intToHSL(hash)
  }

  const intToHSL = str => {
    var shortened = str % 360
    return 'hsl(' + shortened + ',50%, 35%)'
  }

  return (
    <div className={s.room}>
      <div className={s.taskbar}>
        <div className={s.logo} />
        <h1 className={s.planningPoker}>
          <span className={s.thin}>Planning</span>Poker
        </h1>
        <button
          className={[s.leftButtons, s.flip].join(' ')}
          onClick={flipRoom}
        >
          Flip
        </button>
        <button
          className={[s.leftButtons, s.reset].join(' ')}
          onClick={resetRoom}
        >
          Reset
        </button>
      </div>
      <div className={s.ticket}>
        <div className={s.inner}>
          {linkEditable ? (
            <input
              autoFocus
              className={s.ticketField}
              placeholder={room.storyLink}
              onBlur={e => handleStoryLinkBlur(e)}
            />
          ) : (
            <div className={s.storylink} onClick={handleStoryLinkClick}>
              {!room.storyLink && <span>Click to set story link</span>}
              {room.storyLink && <span>{room.storyLink.split('/').pop()}</span>}
              {room.storyLink && (
                <button
                  href={room.storyLink}
                  target="_blank"
                  className={s.link}
                  rel="noopener noreferrer"
                  onClick={e => handleURLClick(e, room.storyLink)}
                />
              )}
            </div>
          )}
          <div className={s.lower}>
            <div>
              Average: <span>{room.flipped ? average(room.votes) : '??'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={s.cardRow}>
        {room.votes.map((value, index) => {
          return (
            <div
              className={`${s.card} animated slideInOffscreenRight faster`}
              key={index}
            >
              <ReactCardFlip
                isFlipped={room.flipped}
                flipDirection="horizontal"
                flipSpeedFrontToBack=".3"
                className={s.cardFlip}
              >
                <div>
                  <ColorCard
                    className={
                      !room.flipped
                        ? value.name.replace(/\s+/g, '-').toLowerCase()
                        : ''
                    }
                    color={getHashCode(value.name)}
                  />
                </div>
                <div className={`${s.flippedCard} ${s['card' + value.vote]}`} />
              </ReactCardFlip>
              <div className={s.name}>{value.name}</div>
            </div>
          )
        })}
      </div>
      <div
        className={loaded ? `${s.vote} animated rotateIn slow delay-1s` : ''}
      >
        <button className={s.card1} color="inherit" onClick={handleVote(1)} />
        <button className={s.card2} color="inherit" onClick={handleVote(2)} />
        <button className={s.card3} color="inherit" onClick={handleVote(3)} />
        <button className={s.card5} color="inherit" onClick={handleVote(5)} />
        <button className={s.card8} color="inherit" onClick={handleVote(8)} />
        <button className={s.card13} color="inherit" onClick={handleVote(13)} />
      </div>
      <Modal isOpen={showModal} style={customStyles}>
        <div className={s.modal}>
          <div>What is your name?</div>
          <input type="text" value={name} onChange={e => handleNameChange(e)} />
          <button onClick={() => handleNameAccept()}>That&apos;s me!</button>
        </div>
      </Modal>
    </div>
  )
}
