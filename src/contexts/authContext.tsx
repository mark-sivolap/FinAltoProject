'use client'
import { createContext } from "react"

interface AuthContext  {
  name: string,
  user_ref: string,
  auth: boolean,
  loaded: boolean,
  token: string,
  logout: () => Promise<void>
}

const defaultContext = {name: '', user_ref:'',auth: false,loaded: false,token: '', logout: async () => {}} as AuthContext
export const authContext = createContext(defaultContext)
