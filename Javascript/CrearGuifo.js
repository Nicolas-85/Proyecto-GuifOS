var recorder;

//Primer imagen de la camara
function comenzarGuifos() {
    const btnComenzar = document.getElementById("capturaUno");//Guardamos el contenedor de la primer pantalla en variable.
    btnComenzar.style.display = "none";// le damos un display none para pasar a la segunda pantalla.
    const pantallaCapturar = document.getElementById("capturaDos");
    pantallaCapturar.style.display = "block";
    //Abajo probamos lo que nos muestra la cámara
    const pruebaCamara = document.getElementById("primerVideo");
    navigator.mediaDevices.getUserMedia({
        video: {
            width: 1280 ,
            height: 434},
        audio: false
    }).then(stream => {                           
        pruebaCamara.srcObject = stream;
        pruebaCamara.play();
        //console.log(pruebaCamara);
    }).catch(console.error)
}

//Esta función es la que genera la grabación de la cámara.
function grabar() {                                                      
    const ocultarPantalla = document.getElementById("capturaDos");//capturar el id capturaDos para abrir el capturaTres.
    ocultarPantalla.style.display = "none";
    const abrirPantalla = document.getElementById("capturaTres");
    abrirPantalla.style.display = "block";
    const pruebaCamara = document.getElementById("grabacionVideo");
    capturaCamara(function(camera){                               //Ejecuta la capturaCamara() con un callback anónimo.
            pruebaCamara.srcObject = camera;
            recorder = new GifRecorder(camera, {
            //type: 'gif', 
            frameRate: 1,
            quality: 10,
            width: 1280, 
            //hidden: 240,

            onGifRecordingStarted: function () {
            console.log('started')
            },

        } );
        console.log(recorder + " este es el recorder");
        recorder.record();
        recorder.camera = camera;

        
    });
}

//Creamos un objeto con los parametros para audio y video
const parametros = {                                            
    video: {
        width: 1280,
        height: 434},
    audio: false
};

//Toma lo que capta la cámara, y ejecuta el callback de la línea 28
function capturaCamara(callback) {                              
    const pruebaCamara = document.getElementById("grabacionVideo");
    navigator.mediaDevices.getUserMedia(parametros)
    .then(function (camera) {
        pruebaCamara.srcObject = camera;
        pruebaCamara.onloadedmetadata = function (e) {
            pruebaCamara.play();
        };
        console.log("estoy acá " + pruebaCamara);
        callback(camera);
    })
    .catch(function (err) { 
        console.log(err.name + ": " + err.message);
    });
}

//Crea y muestra el guif propio.
function mostrarGuifo() {                                           
    const captarListo = document.getElementById("contBtnListo");
    captarListo.style.display = "none";
    const mostrarBtnSubir = document.getElementById("btnSubirGuifos");
    mostrarBtnSubir.style.display = "flex";
    recorder.stop(function(){
        var blob = recorder.blob;
        console.log(blob);
        const url = URL.createObjectURL(blob);
        const guardarVideo = document.getElementById("grabacionVideo");
        //guardarVideo.setAttribute("src", url); - borrar
        guardarVideo.style.display = "none";
        const guifoCreado = document.getElementById("mi_guifo");
        guifoCreado.style.display = "block";
        guifoCreado.setAttribute("src", url);
        const ultimoGuifMostrado = document.getElementById("contMiGuifo");
        ultimoGuifMostrado.setAttribute("src", url);
        //console.log(url); 
        recorder.camera.stop();
    });    
}

//Esta función sube el guif y cambia a la pantalla espera de subida.
function fcnBtnSubir() { 
    const apiKey = "WFAN4kbuW2JqGloXgLHPA3KouN4RHTjq";
    const guardaBtn = document.getElementById("capturaTres");
    guardaBtn.style.display = "none";
    const guardaDivCuatro = document.getElementById("capturaCuatro");
    guardaDivCuatro.style.display = "block";
    var numeroRandom = "mygif" + localStorage.length;
    //llamar funcion barra de carga. 
    barraProgreso();
    try {
        form = new FormData();
        form.append('file', recorder.blob, numeroRandom + '.gif');
        console.log(form.get('file'));
        
        recorder.clearRecordedData();
        recorder = null;
        
        const load = fetch('https://upload.giphy.com/v1/gifs?&api_key=' + apiKey, {
        method: 'POST',
        body: form
    })
    .then((response) => response.json()
    )
    .then((result) => {
        //console.log('Resultado:', result);
        var data = { type: "gif", id: result.data.id }
        localStorage.setItem(numeroRandom, JSON.stringify(data));
        exitoCarga();
       
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    } catch (e) {
        console.log("Uploard Error: " + e);
    };

}

//Cambia a la pantalla de guif creado luego de que responda el then de la línea 116. Llamada en la linea 120.
function exitoCarga() { 
    const guardaBtn = document.getElementById("capturaCuatro");
    guardaBtn.style.display = "none";
    const guardaDivCinco = document.getElementById("capturaCinco");
    guardaDivCinco.style.display = "block";
    const apiKey = "WFAN4kbuW2JqGloXgLHPA3KouN4RHTjq";
    const grillaGuifs = document.getElementById("misguifos");
}
function cargaBody() {
    const apiKey = "WFAN4kbuW2JqGloXgLHPA3KouN4RHTjq";
    for (let index = 0; index < localStorage.length; index++) {
        const element = localStorage.getItem("mygif" + index);
        //console.log(element.id);
        if (element !== null) {
            const idElement = JSON.parse(element);
            //console.log(idElement.id);
            let id = idElement.id;
            var url = "https://api.giphy.com/v1/gifs?&api_key=" + apiKey + "&ids=" + id;
            fetchGifo(url).then(data=>{
                console.log(data + "estamos en esta data");
                const grillaGuifs=document.getElementById("misguifos");
                const guifoTraido = document.createElement("img");
                guifoTraido.setAttribute("src", data.data[0].images.original.url);
                grillaGuifs.appendChild(guifoTraido);
                guifoTraido.classList.add("imagen_tendencias");
            });
            
        }
    }
    
}
function fetchGifo(url) {
    const found = fetch(url)
    .then(response => {
        return response.json();
    })
    .then(data => {
        return data;
        
    })
    .catch(error => {
        console.log(error)
        return error;
    });
    return found;
}

//Descraga de Guif por boton.
function descargarGif(){
    const gifCreado = document.getElementById("contMiGuifo").src;
    var a = document.createElement('a');
    a.href= gifCreado;
    a.download = true;
    a.target = '_blank';
    a.click()
}

//Copiar URL por boton.
function copiarUrl() {
    
    // Crea un campo de texto 
    var campo = document.createElement("input");
    
    // Asigna el contenido del elemento especificado al valor del campo
    campo.setAttribute("value", document.getElementById("contMiGuifo").src);
    
    // Añade el campo a la página
    document.body.appendChild(campo);
    
    // Selecciona el contenido del campo
    campo.select();
    
    // Copia el texto seleccionado
    document.execCommand("copy");
    
    // Elimina el campo de la página
    document.body.removeChild(campo);
}


//Barra progresiva.
function barraProgreso() {
    var elem = document.getElementById("barra");   
    var width = 1;
    var id = setInterval(frame, 100); 
    function frame() {
      if (width >= 100) {
        clearInterval(id);           
      } else {
        width++; 
        elem.style.width = width + '%'; 
      }
    }
}


