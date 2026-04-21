import express from "express"
import { PrismaClient } from "./generated/prisma/client.js"
import cors from "cors"

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// ================== GET USERS ==================
app.get("/usuarios", async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar usuários",
      details: error.message
    })
  }
})

// ================== CREATE USER ==================
app.post("/usuarios", async (req, res) => {
  try {
    let { email, age, name, password, avatarId } = req.body

    if (!email || !name || !password) {
      return res.status(400).json({
        error: "Preencha todos os campos obrigatórios"
      })
    }

    email = email.trim().toLowerCase()

    // 🔥 verifica email duplicado
    const userExists = await prisma.user.findFirst({
      where: { email }
    })

    if (userExists) {
      return res.status(400).json({
        error: "Email já cadastrado"
      })
    }

    const user = await prisma.user.create({
      data: {
        email,
        age: Number(age),
        name,
        password,
        avatarId: Number(avatarId)
      }
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar usuário",
      details: error.message
    })
  }
})

// ================== LOGIN (NAME + PASSWORD) ==================
app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body

    if (!name || !password) {
      return res.status(400).json({
        error: "Preencha nome e senha"
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        name,
        password
      }
    })

    if (!user) {
      return res.status(401).json({
        error: "Nome ou senha inválidos"
      })
    }

    return res.status(200).json({
      message: "Login realizado com sucesso",
      user
    })
  } catch (error) {
    return res.status(500).json({
      error: "Erro no login"
    })
  }
})

// ================== UPDATE USER ==================
app.put("/usuarios/:id", async (req, res) => {
  try {
    let { email, age, name, password, avatarId } = req.body

    email = email.trim().toLowerCase()

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        email,
        age: Number(age),
        name,
        password,
        avatarId: Number(avatarId)
      }
    })

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao atualizar usuário",
      details: error.message
    })
  }
})

// ================== DELETE ==================
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    })

    return res.status(200).json({
      message: "Usuário deletado com sucesso!"
    })
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao deletar usuário"
    })
  }
})

// ================== RECUPERAR SENHA ==================
app.post("/recuperar-senha", async (req, res) => {
  try {
    let { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: "Email é obrigatório"
      })
    }

    email = email.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({
        message: "Email não encontrado"
      })
    }

    return res.status(200).json({
      message: "Email válido"
    })
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno do servidor"
    })
  }
})

// ================== ATUALIZAR SENHA ==================
app.put("/atualizar-senha", async (req, res) => {
  try {
    let { email, novaSenha } = req.body

    if (!email || !novaSenha) {
      return res.status(400).json({
        message: "Email e nova senha são obrigatórios"
      })
    }

    email = email.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado"
      })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: novaSenha
      }
    })

    return res.status(200).json({
      message: "Senha atualizada com sucesso"
    })
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar senha"
    })
  }
})

// ================== SERVER ==================
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})