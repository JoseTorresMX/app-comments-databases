const form = document.getElementById("formulario");
const listaComentarios = document.getElementById("lista-comentarios");
// Observable para cargar comentarios
const cargarComentarios$ = new rxjs.Observable((subscriber) => {
  fetch("http://localhost:3000/comentarios")
    .then((response) => response.json())
    .then((data) => {
      subscriber.next(data);
      subscriber.complete();
    })
    .catch((err) => subscriber.error(err));
});
// Mostrar comentarios
function mostrarComentarios(comentarios) {
  listaComentarios.innerHTML = comentarios
    .map(
      (c) => `
    <div class="comentario">
    <strong>${c.nombre}</strong> (${c.email}): ${c.comentario}
    </div>
    `
    )
    .join("");
}
// Suscribirse para cargar comentarios al inicio
cargarComentarios$.subscribe(mostrarComentarios);
// Evento para enviar un comentario
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nuevoComentario = {
    nombre: form.nombre.value,
    email: form.email.value,
    comentario: form.comentario.value,
  };
  fetch("http://localhost:3000/comentarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoComentario),
  })
    .then(() => cargarComentarios$.subscribe(mostrarComentarios))
    .catch((err) => alert("Error al enviar comentario"));
});
