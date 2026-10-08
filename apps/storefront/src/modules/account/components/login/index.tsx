import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="ec-display mb-6 text-center text-[clamp(2.5rem,5vw,3.5rem)] text-ecaille-lien">
        Bon retour parmi nous
      </h1>
      <p className="text-center text-base-regular text-ecaille-brume mb-8">
        Connectez-vous pour retrouver vos commandes et vos adresses.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="E-mail"
            name="email"
            type="email"
            title="Saisissez une adresse e-mail valide."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Se connecter
        </SubmitButton>
      </form>
      <span className="text-center text-ecaille-brume text-small-regular mt-6">
        Pas encore de compte ?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-ecaille-lien underline"
          data-testid="register-button"
        >
          Créer un compte
        </button>
        .
      </span>
    </div>
  )
}

export default Login
