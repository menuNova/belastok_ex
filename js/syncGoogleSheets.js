import { main } from "./main.js";
import { setDishesData } from "./store.js";

let auth = 'AKfycbxcNnJ01Uscel2ZfKe4SzQ-hqv9_0PwXQMafNJDPLfp-YemWqt0DVZqPtdFeYuvT6lF'
let api = `https://script.google.com/macros/s/${auth}/exec`;


let USD_BYN_RATE = 3.3;



async function fetchDishesList() {
    const loadingPreloader = document.getElementById('loadingPreloader');
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        };
        const data = await response.json();
        processData(data);
        document.getElementById('mainNav').classList.remove('hidden');
        document.querySelector('main.dishes').classList.remove('hidden');
        document.querySelector('section.cart').classList.remove('hidden');
        setTimeout(() => {
            loadingPreloader.classList.add('hidden');
        }, 200);
    } catch (error) {
        console.error('Ошибка:', error);
        loadingPreloader.textContent = 'Ошибка загрузки меню. Пожалуйста, попробуйте позже.';
    };
};

fetchDishesList();

function processData(data) {
    const keys = data[0];
    const objectsArray = data.slice(1).map(row => {
        let obj = {};
        row.forEach((value, index) => {
            obj[keys[index]] = value;
        });
        return obj;
    });

    const dishData = {};
    objectsArray.forEach(item => {
        const categoryKey = item['category-en'].split(' ').join('_');

        if (!dishData[categoryKey]) {
            dishData[categoryKey] = {
                name: {
                    ru: item['category-ru'],
                    en: item['category-en'],
                    de: item['category-de'],
                },
                items: [],
            };
        }

        const dish = {
            name: {
                ru: item['name-ru'],
                en: item['name-en'],
                de: item['name-de'],
            },
            price: {},
            description: {
                ru: item['description-ru'],
                en: item['description-en'],
                de: item['description-de'],
            },
            img: item['img']
        };

        for (let i = 1; i <= 3; i++) {
            const portionKey = `porirtion${i}`;
            const priceKey = `price${i}`;
            const portion = item[portionKey];
            const price = item[priceKey];

            if (portion && price) {
                dish.price[portion] = Math.round(parseFloat(price) / USD_BYN_RATE * 10) / 10;
            }
        }
        dishData[categoryKey].items.push(dish);
    });

    setDishesData(dishData);
    main();
};

export let additData = {
    bg: {
        menu: './img/main/bg-1.jpg',
        main: './img/main/bg-1.jpg',
    },
    colors: {
        darkTheme: {
            color0: 'rgba(0, 0, 0, 0.7)',
            color1: '#060606',
            color1_1: '#120f0c59',
            color1_5: '#150b04c5',
            color2: '#39090f',
            color3: '#c2404f',
            color4: '#f4f9fb',
        },

        lightTheme: {
            color0: 'rgba(255, 255, 255, 0.7)',
            color1: '#f4f9fb',
            color1_1: '#f4f9fb59',
            color1_5: '#f4f9fbc5',
            color2: '#f9b7bf',
            color3: '#87232f',
            color4: '#030303',
        },
    },
};


