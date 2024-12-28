import { data } from "./store.js"

let table = new URLSearchParams(window.location.search).get('table')
if (table) {
    localStorage.setItem('table', table)
};

let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.body.classList.add(`${theme}-theme`);

if (theme !== 'light' && theme !== 'dark') {
    document.body.classList.add('light-theme');
};

document.title = data.name;