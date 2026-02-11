import axios from "axios"

export const api = axios.create({
    // On laisse le navigateur appeler la même origine (Next.js sur :3003)
    // puis Next.js proxyfie vers l'API Gateway via next.config.js.
    baseURL: "",
    // Important pour envoyer les cookies de session (Supertokens)
    // entre le front (Next.js) et l'API Gateway.
    withCredentials: true,
})
