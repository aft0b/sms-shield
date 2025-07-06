async function protectNumber() {
    const number = document.getElementById('phone').value;
    const message = document.getElementById('message');
  
    try {
        const response = await fetch('http://localhost:5000/api/protect', 
            {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: number })
      });
  
      const data = await response.json();
      message.innerText = data.message || data.error;
    } catch (err) {
      message.innerText = "Server error.";
    }
  }
  