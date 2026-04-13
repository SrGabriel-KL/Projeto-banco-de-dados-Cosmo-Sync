import express from "express"
import { PrismaClient } from "./generated/prisma/client.js"
import cors from "cors"

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get("/usuarios", async (request, response) => {
  try {
    const users = await prisma.user.findMany()
    return response.status(200).json(users)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return response.status(500).json({
      error: "Erro ao buscar usuários"
    })
  }
})

app.post("/usuarios", async (request, response) => {
  try {
    console.log("BODY:", request.body)

    const { email, age, name, avatarId } = request.body

    const user = await prisma.user.create({
      data: {
        email,
        age: Number(age),
        name,
        avatarId: Number(avatarId)
      }
    })

    return response.status(201).json(user)
  } catch (error) {
    console.error("Erro ao criar usuário:", error)

    return response.status(500).json({
      error: "Erro ao criar usuário",
      details: error.message
    })
  }
})

app.put("/usuarios/:id", async (request, response) => {
  try {
    const { email, age, name, avatarId } = request.body

    const user = await prisma.user.update({
      where: {
        id: request.params.id
      },
      data: {
        email,
        age: Number(age),
        name,
        avatarId: Number(avatarId)
      }
    })

    return response.status(200).json(user)
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)

    return response.status(500).json({
      error: "Erro ao atualizar usuário"
    })
  }
})

app.delete("/usuarios/:id", async (request, response) => {
  try {
    await prisma.user.delete({
      where: {
        id: request.params.id
      }
    })

    return response.status(200).json({
      message: "Usuário deletado com sucesso!"
    })
  } catch (error) {
    console.error("Erro ao deletar usuário:", error)

    return response.status(500).json({
      error: "Erro ao deletar usuário"
    })
  }
})

app.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000")
})


/*
MongoDB


gabriel_sena

http://localhost:3000

xZN6gNCJF5h3DEjH

*/