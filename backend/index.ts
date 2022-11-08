import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
const server = express()

interface Game {
  id: string
  price: number
  name: string
  year: number
}

interface User {
  id: string
  name: string
  password: string
  email: string
}

interface DB {
  games: Game[]
  users: User[]
}

export const JWTSecret = 'ABC1234'

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization

  if (!authToken) {
    return res.status(401).json({ message: 'Invalid Token' })
  }

  const token = authToken.replace('Bearer ', '')

  jwt.verify(token, JWTSecret, (error, data) => {
    if (error) {
      return res.status(401).json({ message: 'Invalid Token' })
    }

    next()
  })
}

const database: DB = {
  games: [],
  users: [
    {
      id: '12345',
      email: 'JonhDoe@example.com',
      name: 'Jonh',
      password: 'abc123',
    },
  ],
}

server.use(cors())
server.use(express.urlencoded({ extended: true }))
server.use(express.json())

server.get('/games', auth, (req, res) => {
  return res.status(200).json(database.games)
})

server.get('/game/:id', auth, (req, res) => {
  const { id } = req.params

  const game = database.games.find((game) => game.id === id)

  if (!game) {
    return res.status(404).json({ message: 'Game not found' })
  }

  return res.status(200).json(game)
})

server.post('/game', auth, (req, res) => {
  const bodyReq = req.body as Omit<Game, 'id'>

  const newGame = {
    id: uuid(),
    ...bodyReq,
  }

  database.games.push(newGame)

  return res.status(200).json(newGame)
})

server.delete('/game/:id', auth, (req, res) => {
  const { id } = req.params

  const index = database.games.findIndex((game) => {
    return game.id === id
  })

  if (!!index) {
    return res.status(404).json({ message: 'Game not found' })
  }

  const gameDeleted = database.games[index]
  database.games.splice(index, 1)

  return res.status(200).json({ ...gameDeleted })
})

server.put('/game/:id', auth, (req, res) => {
  const { id } = req.params

  const game = database.games.find((game) => game.id === id)

  if (game === undefined) {
    return res.status(404).json({ message: 'Game not found' })
  } else {
    const bodyReq: Partial<Game> = req.body

    if (bodyReq.price) {
      game.price = bodyReq.price
    }

    if (bodyReq.name) {
      game.name = bodyReq.name
    }

    if (bodyReq.year) {
      game.year = bodyReq.year
    }

    return res.status(200).json(game)
  }
})

server.post('/auth', (req, res) => {
  const { email, password } = req.body as User

  if (!email) {
    return res.status(400).json({ message: 'Invalid email' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Invalid password' })
  }

  const user = database.users.find((user) => user.email === email)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  jwt.sign(
    { email, id: user.id },
    JWTSecret,
    { expiresIn: '1h' },
    (err, token) => {
      if (err) {
        return res.status(500).json({ message: 'Internal failure' })
      }

      return res.status(200).json({ token })
    }
  )
})

server.listen(3000, () => {
  console.log('http://localhost:3000/games')
})
