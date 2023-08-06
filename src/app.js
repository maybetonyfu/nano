import App from './Main.svelte'
import { inject } from '@vercel/analytics';
 
// console.log(import.meta.env)
if (import.meta.env.PROD) {
    inject()
}
const app = new App({
    target: document.getElementById('app')
})
export default app
