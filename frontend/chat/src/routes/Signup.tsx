import React, { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";

export default function Signup() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorResponse, setErrorResponse] = useState("")

  const auth = useAuth()
  const goTo = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        console.log("User created successfully")
        setErrorResponse("")

        goTo("/")
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
      <form className="form" onSubmit={handleSubmit}>
        <h1>Signup</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        <label htmlFor="">Username</label>
        <input type="text" name="" id="" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="">Password</label>
        <input type="password" name="" id="" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button>Create user</button>
      </form>
    </DefaultLayout>
  )
}
