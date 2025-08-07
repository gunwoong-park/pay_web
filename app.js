const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서빙 설정
app.use(express.static(__dirname));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'payment.html'));
});

app.get('/coupon', (req, res) => {
  res.sendFile(path.join(__dirname, 'coupon.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});