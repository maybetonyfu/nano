import Main from './Main.svelte'
import { inject } from '@vercel/analytics';
 
// console.log(import.meta.env)
if (import.meta.env.PROD) {
    inject()
}
const app = new Main({
    target: document.getElementById('app')
})


export default app
