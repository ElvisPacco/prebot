function enviarMensaje() {
    const numero = document.getElementById('numero').value;
    const mensaje = document.getElementById('mensaje').value;
  
    fetch(`http://localhost:3000/enviar?numero=${numero}&mensaje=${encodeURIComponent(mensaje)}`)
      .then(res => res.text())
      .then(alert)
      .catch(err => alert('Error: ' + err));
  }