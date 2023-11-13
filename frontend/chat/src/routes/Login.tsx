import React, { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponse, AuthResponseError } from "../types/types";

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorResponse, setErrorResponse] = useState("")

  const auth = useAuth()
  const goTo = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        console.log("Login successful")
        setErrorResponse("")

        const json = (await response.json()) as AuthResponse

        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json)
          goTo("/Dashboard")
        }
      } else {
        console.log("Something went wrong")
        const json = await response.json() as AuthResponseError
        setErrorResponse(json.body.error)
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/Dashboard" />
  }

  return (
    <DefaultLayout>
      <form action="" className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        <label htmlFor="">Username</label>
        <input type="text" name="" id="" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="">Password</label>
        <input type="password" name="" id="" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button>Login</button>
      </form>
    </DefaultLayout>
  )
}
