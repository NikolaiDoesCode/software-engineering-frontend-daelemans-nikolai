function handleSubmit(e) {
    e.preventDefault();

    const captchaResponse = grecaptcha.getResponse();

    if(captchaResponse.length === 0){
        throw new Error("Captcha not complete");
    }

    const fd = new FormData(e.target);
    const params = new URLSearchParams(fd);

    fetch('http://httpbin.org/post', {
        method: "POST",
        body: params,
    })
    .then(res => json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}
console.log("hello")
