const verifyCaptcha = async (captchaResponse: string) => {
    const response = await fetch('http://localhost:8080/catpchaPHP.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: new URLSearchParams({ token: captchaResponse }),
    });
  
    if (!response.ok) {
      throw new Error('Captcha verification failed');
    }
  
    const data = await response.json();
    return data;
  };
  
  export default { verifyCaptcha };
  