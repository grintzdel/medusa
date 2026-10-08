import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Se connecter",
  description: "Connectez-vous à votre compte Écaille.",
}

export default function Login() {
  return <LoginTemplate />
}
