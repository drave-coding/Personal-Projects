
const hr = document.querySelector('#hr');
const min = document.querySelector('#min');
const sec = document.querySelector('#sec');

setInterval(() => {
    const date = new Date();
    const hh = date.getHours()*30;
    const mm = date.getMinutes()*6;
    
    const ss = date.getSeconds()*6;

    hr.style.transform = `rotate(${hh + (mm/12)}deg)`;
    min.style.transform = `rotate(${mm}deg)`;
    sec.style.transform = `rotate(${ss}deg)`;

    
})