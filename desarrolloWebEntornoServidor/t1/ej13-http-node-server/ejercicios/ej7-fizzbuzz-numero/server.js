import http from 'http';
import { URL } from 'url';

const server = http.createServer((req, res) => {
    const myUrl = new URL(req.url, `http://${req.headers.host}`);
    const num = parseInt(myUrl.searchParams.get('num'));

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    if (!num || isNaN(num)) {
        res.end('Por favor, indica un número en la query string.');
        return;
    }

    let result = '';
    for (let i = 1; i <= num; i++) {
        if (i % 3 === 0 && i % 5 === 0) result += 'FizzBuzz\n';
        else if (i % 3 === 0) result += 'Fizz\n';
        else if (i % 5 === 0) result += 'Buzz\n';
        else result += `${i}\n`;
    }

    res.end(result);
});

server.listen(3000, () => {
    console.log('Servidor FizzBuzz en http://localhost:3000');
});
