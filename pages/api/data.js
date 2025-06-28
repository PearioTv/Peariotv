export default function handler(req, res) {
  res.status(200).json([
    {"title":"لعبة الحبّار","poster":"https://image.tmdb.org/t/p/w500/6f0Uokj58OGzgYjGobeJZDtTcUX.jpg","id":"934632"},
    {"title":"逆爱","poster":"https://image.tmdb.org/t/p/w500/jj4JzLmsucNPcnQbpZmMJqzmwCl.jpg","id":"974453"},
    {"title":"Smoke","poster":"https://image.tmdb.org/t/p/w500/p789YfZtMqe3ErII3t61FWmAaFQ.jpg","id":"874321"}
  ]);
}