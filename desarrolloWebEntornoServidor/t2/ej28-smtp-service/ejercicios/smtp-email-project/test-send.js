fetch('http://localhost:3000/api/email/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        to: 'test@ejemplo.com',
        subject: 'Test',
        text: 'Hola',
        html: '<h1>Hola</h1>'
    })
})
.then(response => response.json())
.then(data => console.log('Respuesta:', JSON.stringify(data, null, 2)))
.catch(error => console.error('Error:', error.message));
