import express from "express"
import { PrismaClient } from "./generated/prisma/client.js"
import cors from "cors"

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// ================== GET USERS ==================
app.get("/usuarios", async (request, response) => {
  try {
    const users = await prisma.user.findMany()
    return response.status(200).json(users)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return response.status(500).json({
      error: "Erro ao buscar usuários",
      details: error.message
    })
  }
})

// ================== CREATE USER ==================
app.post("/usuarios", async (request, response) => {
  try {
    let { email, age, name, password, avatarId } = request.body

    // 🔥 normaliza email
    email = email.trim().toLowerCase()

    const user = await prisma.user.create({
      data: {
        email,
        age: Number(age),
        name,
        password,
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

// ================== LOGIN ==================
app.post("/login", async (request, response) => {
  try {
    const { name, password } = request.body

    if (!name || !password) {
      return response.status(400).json({
        error: "Preencha login e senha"
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        name,
        password
      }
    })

    if (!user) {
      return response.status(401).json({
        error: "Login ou senha inválidos"
      })
    }

    return response.status(200).json({
      message: "Login realizado com sucesso",
      user
    })
  } catch (error) {
    return response.status(500).json({
      error: "Erro no login"
    })
  }
})

// ================== UPDATE USER ==================
app.put("/usuarios/:id", async (request, response) => {
  try {
    let { email, age, name, password, avatarId } = request.body

    email = email.trim().toLowerCase()

    const user = await prisma.user.update({
      where: {
        id: request.params.id
      },
      data: {
        email,
        age: Number(age),
        name,
        password,
        avatarId: Number(avatarId)
      }
    })

    return response.status(200).json(user)
  } catch (error) {
    console.error("ERRO PUT:", error)
    return response.status(500).json({
      error: "Erro ao atualizar usuário",
      details: error.message
    })
  }
})

// ================== DELETE ==================
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

// ================== RECUPERAR SENHA ==================
app.post("/recuperar-senha", async (request, response) => {
  try {
    let { email } = request.body

    // 🔥 normaliza
    email = email.trim().toLowerCase()

    console.log("EMAIL RECEBIDO:", email)

    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user) {
      return response.status(404).json({
        message: "Email não encontrado"
      })
    }

    return response.status(200).json({
      message: "Email válido"
    })
  } catch (error) {
    console.error("Erro ao validar email:", error)
    return response.status(500).json({
      message: "Erro interno do servidor"
    })
  }
})

// ================== ATUALIZAR SENHA ==================
app.put("/atualizar-senha", async (request, response) => {
  try {
    let { email, novaSenha } = request.body

    email = email.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user) {
      return response.status(404).json({
        message: "Usuário não encontrado"
      })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: novaSenha
      }
    })

    return response.status(200).json({
      message: "Senha atualizada com sucesso",
      user: updatedUser
    })
  } catch (error) {
    console.error("Erro ao atualizar senha:", error)
    return response.status(500).json({
      message: "Erro ao atualizar senha"
    })
  }
})

// ================== SERVER ==================
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})