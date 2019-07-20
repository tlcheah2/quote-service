const http = require("http");
const duration = 1500000; // 25 minutes

exports.keepAwake = () => {
    setInterval(function() {
        http.get("https://motivational-quote-service.herokuapp.com");
    }, duration);// every 25 minutes (1500000)
}