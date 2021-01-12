const apiKey = "WFAN4kbuW2JqGloXgLHPA3KouN4RHTjq"; //API key. Mi llave de ingreso.

//Llamada a la API.
async function llamadaRandom(llave) {              
    const llamadaApi = await fetch("https://api.giphy.com/v1/gifs/random?q="+"&api_key="+llave);
    const resultado = await llamadaApi.json();
    //console.log(resultado);
    return resultado;
}

//Traigo los guifs de sugerencias. 
 async function modifica_sugerencia() {        
    const arrayImg = document.querySelectorAll(".cambio");
    //console.log(array_img);
    for (let index = 0; index < arrayImg.length; index++) {
       const objeto = await llamadaRandom(apiKey);
       //console.log(objeto);
       const img = arrayImg[index];
       img.setAttribute("src", objeto.data.images.downsized.url);
       const tituloGif = document.getElementsByClassName("tirulo_gif_sugerencia");
       tituloGif[index].innerHTML = objeto.data.title;
       //console.log(objeto.data.user.display_name);
       //console.log(tituloGif);
    }
}
modifica_sugerencia();

//Llamada para traer las tendencias.
async function llamadaTendencia(llave) {
    const llamadaApi = await fetch("https://api.giphy.com/v1/gifs/trending?q="+"&api_key="+llave+"&limit=20");
    const resultado = await llamadaApi.json();
    //console.log(resultado);
    return resultado;
}

//Traigo los guifs de tendencias.
async function modifica_tendencia() {
    const grillaTendencias = document.getElementById("grilla_tendencias");
    const arrayGif = await llamadaTendencia(apiKey);
    console.log(arrayGif);
    for (let index = 0; index < 20; index++) {
        const element = arrayGif.data[index];
        const imgTendencia = document.createElement("img");
        imgTendencia.setAttribute("src", element.images.downsized.url);
        //imgTendencia.addEventListener("mouseover", hoverTendencia());
        imgTendencia.classList.add("imagen_tendencias");
        //grillaTendencias.appendChild(imgTendencia);
        const divHover = document.createElement("div");
        divHover.classList.add("divHover");
        divHover.innerHTML = corteString(arrayGif.data[index].title);
        const divTotal = document.createElement("div");
        divTotal.classList.add("contHover");
        divTotal.appendChild(divHover);
        divTotal.appendChild(imgTendencia);
        grillaTendencias.appendChild(divTotal);
        //console.log(imgTendencia);
    }
    const verHover = document.getElementsByClassName("contHover");
    hoverTendencia(verHover);
}

function corteString(x) {
    if (x.length >= 25) {
        let y = x.slice (0, 20);
        let textoFinal= "#" + y + "...";
        return textoFinal;   
    } 
    return x;
}

function hoverTendencia(array) {
    const guardaArray = array;
    const tomaDivHover = document.getElementsByClassName("divHover");
    for (let index = 0; index < guardaArray.length; index++) {
        const element = guardaArray[index];
        element.addEventListener("mouseover", function(){
            tomaDivHover[index].style.display = "block";
        })
        element.addEventListener("mouseout", function(){
            tomaDivHover[index].style.display = "none";
        }) 
    }    
}
modifica_tendencia();

//Oculto la sección Sugerencias y muestro Tendencias con otro título.
function muestraResultadoBuqueda() {
    const ocultarSugerencia = document.getElementById("seccion_sugerencia");
    ocultarSugerencia.style.display = "none";
    const cambioTitulo = document.getElementById("titulo_tendencia");
    const textoBusqueda = document.getElementById("ingreso_text_busqueda").value;
    cambioTitulo.innerHTML = "Resultado de búsqueda: " + textoBusqueda;
}

//Esta funcion muestra los gifs buscados reemplazandolos por la sección tendencias.
async function busqueda_gif() { 
    const apiKey = "WFAN4kbuW2JqGloXgLHPA3KouN4RHTjq";
    const textoBusqueda = document.getElementById("ingreso_text_busqueda").value;//Guardo la info del texto que se busca.
    //console.log(textoBusqueda);
    
    if (textoBusqueda.length > 1) {
        const llamadaApi = await fetch("https://api.giphy.com/v1/gifs/search?q=" + textoBusqueda + "&api_key=" + apiKey +"&limit=20"); //llamada a la api para las busquedas.
        const resultado = await llamadaApi.json();
            for (let index = 0; index < resultado.data.length; index++) {
                const element = resultado.data[index];
                const cambioGifsBusqueda = document.getElementsByClassName("imagen_tendencias");
                //console.log(cambioGifsBusqueda);
                const gifsBusquedaNuevos = cambioGifsBusqueda[index];
                //console.log(gifsBusquedaNuevos);
                gifsBusquedaNuevos.setAttribute("src", element.images.downsized.url);
            }
    muestraResultadoBuqueda();
    historialBusqueda(textoBusqueda);
        const abrirPanel = document.getElementById("lista_suegercia");
        abrirPanel.style.display = "none";
    }    
}

function historialBusqueda(nada) {
    const divHistorial = document.getElementById("historial");
    divHistorial.style.display = "flex";
    const spanHistorial = document.createElement("span");
    spanHistorial.innerHTML = nada;
    divHistorial.appendChild(spanHistorial);
    spanHistorial.classList.add("textoHistorial");
}



//Llamada a la API para la sección de Búsqueda.
async function llamadaString (llamada) {
    const apiKey = "WFAN4kbuW2JqGloXgLHPA3KouN4RHTjq";
    const llamadaApi = await fetch("https://api.giphy.com/v1/gifs/search/tags?q="+llamada+"&api_key="+apiKey);
    const resultado = await llamadaApi.json();
    console.log(resultado);
    return resultado;
}

//Se toma la info de la llamada para mostrar los resultados de las búsquedas.
async function detectaInput() {
    const textoInput = document.getElementById("ingreso_text_busqueda").value; //Acá se guarda lo que ingreso en el Input
    if (textoInput.length === 3) {
        const abrirPanel = document.getElementById("lista_suegercia");
        abrirPanel.style.display = "block";//Con esta condición se abre el DIV
        var colorBtn = document.getElementById("boton_buscar");
        colorBtn.style.backgroundColor = "#F7C9F3";
        colorBtn.style.color = "#110038";
        const resultadoLlamada = await llamadaString(textoInput);//Ejecuto la funcion que llama a la API.
        for (let index = 0; index < 4 ; index++) {
            const element = resultadoLlamada.data[index];
            console.log(element); 
            const btn = document.getElementsByClassName("btn");
            btn[index].innerHTML = element.name;
        }
    } if (textoInput.length === 1) {
        const abrirPanel = document.getElementById("lista_suegercia");
        abrirPanel.style.display = "none";
        var colorBtn = document.getElementById("boton_buscar");
        colorBtn.style.backgroundColor = "#E6E6E6";
        colorBtn.style.color = "#B4B4B4"; 
    }
}

//Se inserta el valor de la sugerencia de búsqueda en el panel de búsqueda para que haga la llamada.
function salidaBoton(esto) {
    const valorBtn = esto.innerHTML;
    //console.log(valorBtn);
    const inputBusqueda = document.getElementById("ingreso_text_busqueda");
    inputBusqueda.value = valorBtn;
    busqueda_gif();
    const abrirPanel = document.getElementById("lista_suegercia");
    abrirPanel.style.display = "none";

}

//Funcion para desplegar cuadro con botones para cambiar el tema de las pantallas.
function displayBlockTemas() {
    const divTemas = document.getElementById("listaTemas");
    divTemas.style.display = "flex";
}
//Estas funciónes cambia los colores de los temas día y noche.
function temaNoche() {
    const divTemas = document.getElementById("listaTemas");
    divTemas.style.display = "none";
    const bodyNoche = document.body;
    bodyNoche.style.backgroundColor = "#290654";
    const cambioLogo = document.getElementById("logo");
    cambioLogo.setAttribute("src", "Assets/gifOF_logo_dark.png");
    const cambioBotones = document.getElementsByClassName("formato_boton");
    const cambioCrear = document.getElementById("nocheCrear");
    cambioCrear.style.color = "#FFFFFF";
    for (let index = 0; index < cambioBotones.length; index++) {
        const element = cambioBotones[index];
        element.style.backgroundColor = "#EE3EFE";
        const cambioFuente = document.getElementsByClassName("fuente_boton");
        cambioFuente[index].style.color = "#FFFFFF";
    }  
}

function temaDia() {
    const divTemas = document.getElementById("listaTemas");
    divTemas.style.display = "none";
    const bodyNoche = document.body;
    bodyNoche.style.backgroundColor = "#fff4fd";
    const cambioLogo = document.getElementById("logo");
    cambioLogo.setAttribute("src", "Assets/gifOF_logo.png");
    const cambioBotones = document.getElementsByClassName("formato_boton");
    const cambioCrear = document.getElementById("nocheCrear");
    cambioCrear.style.color = "#110038";
    for (let index = 0; index < cambioBotones.length; index++) {
        const element = cambioBotones[index];
        element.style.backgroundColor = "#F7C9F3";
        const cambioFuente = document.getElementsByClassName("fuente_boton");
        cambioFuente[index].style.color = "#110038";
    }
}