document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('myButton');
    const paragraph = document.querySelector('main .mono');
    const container = document.querySelector('.container');

    button.addEventListener('click', () => {
        // Flash effect
        container.style.borderColor = '#ff0000';
        paragraph.textContent = 'SYSTEM OVERLOAD';
        paragraph.style.color = '#ff0000';
        
        // Reset after 1 second
        setTimeout(() => {
            container.style.borderColor = '#fff';
            paragraph.textContent = 'THIS IS A BRUTALIST WEB EXPERIENCE';
            paragraph.style.color = '#fff';
        }, 1000);
    });
}); 