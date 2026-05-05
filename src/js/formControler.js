(() => {
const btnNext1 = document.querySelector('#button-next-1');
const btnNext2 = document.querySelector('#button-next-2');
const btnBack2 = document.querySelector('#button-back-2');
const btnNext3 = document.querySelector('#button-next-3');
const btnBack3 = document.querySelector('#button-back-3');
const btnNext4 = document.querySelector('#button-next-4');
const btnBack4 = document.querySelector('#button-back-4');

const form1 = document.querySelector('fieldset.userId');
const form2 = document.querySelector('fieldset.userEmail');
const form3 = document.querySelector('fieldset.userContact');
const form4 = document.querySelector('fieldset.termsAndSystem');



btnNext1.addEventListener('click', ()=>{
    form1.classList.remove('ativo');
    form2.classList.add('ativo');
})

btnNext2.addEventListener('click', ()=>{
    form2.classList.remove('ativo');
    form3.classList.add('ativo');
})

btnBack2.addEventListener('click', ()=>{
    form2.classList.remove('ativo');
    form1.classList.add('ativo');
})

btnNext3.addEventListener('click', ()=>{
    form3.classList.remove('ativo');
    form4.classList.add('ativo');
})

btnBack3.addEventListener('click', ()=>{
    form3.classList.remove('ativo');
    form2.classList.add('ativo');
})

btnNext4.addEventListener('click', ()=>{
    form4.classList.remove('ativo');
    window.location.href = 'index.html';
})

btnBack4.addEventListener('click', ()=>{
    form4.classList.remove('ativo');
    form3.classList.add('ativo');

})


})();



