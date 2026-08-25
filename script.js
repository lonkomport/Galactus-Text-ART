// =========================================
// ELEMENTOS DO HTML
// =========================================

const imageInput =
    document.getElementById("imageInput");

const uploadButton =
    document.getElementById("uploadButton");

const fileName =
    document.getElementById("fileName");

const characterInput =
    document.getElementById("character");

const widthInput =
    document.getElementById("width");

const widthValue =
    document.getElementById("widthValue");

const contrastInput =
    document.getElementById("contrast");

const contrastValue =
    document.getElementById("contrastValue");

const brightnessInput =
    document.getElementById("brightness");

const brightnessValue =
    document.getElementById("brightnessValue");

const densityInput =
    document.getElementById("density");

const densityValue =
    document.getElementById("densityValue");

const modeInput =
    document.getElementById("mode");

const invertInput =
    document.getElementById("invert");

const output =
    document.getElementById("output");

const copyButton =
    document.getElementById("copyButton");

const clearButton =
    document.getElementById("clearButton");

const emptyMessage =
    document.getElementById("emptyMessage");

const resultInfo =
    document.getElementById("resultInfo");

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");


// =========================================
// VARIÁVEIS
// =========================================

let imagem = null;


// =========================================
// PALETAS DE CARACTERES
// =========================================

const PALETAS = {

    dots:
        " ·:+*#%@",

    ascii:
        " .:-=+*#%@",

    blocks:
        " ░▒▓█"

};


// =========================================
// SELECIONAR IMAGEM
// =========================================

imageInput.addEventListener(
    "change",
    function (event) {

        const arquivo =
            event.target.files[0];


        if (!arquivo) {
            return;
        }


        if (!arquivo.type.startsWith("image/")) {

            alert(
                "Selecione um arquivo de imagem válido."
            );

            return;
        }


        fileName.textContent =
            arquivo.name;


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                imagem =
                    new Image();


                imagem.onload =
                    function () {

                        console.log(
                            "Imagem carregada:",
                            imagem.width,
                            "x",
                            imagem.height
                        );


                        converterImagem();

                    };


                imagem.onerror =
                    function () {

                        alert(
                            "Não foi possível carregar a imagem."
                        );

                    };


                imagem.src =
                    event.target.result;

            };


        reader.onerror =
            function () {

                alert(
                    "Não foi possível ler o arquivo."
                );

            };


        reader.readAsDataURL(
            arquivo
        );

    }
);


// =========================================
// LARGURA
// =========================================

widthInput.addEventListener(
    "input",
    function () {

        widthValue.textContent =
            this.value;

        converterImagem();

    }
);


// =========================================
// CONTRASTE
// =========================================

contrastInput.addEventListener(
    "input",
    function () {

        contrastValue.textContent =
            this.value;

        converterImagem();

    }
);


// =========================================
// BRILHO
// =========================================

brightnessInput.addEventListener(
    "input",
    function () {

        brightnessValue.textContent =
            this.value;

        converterImagem();

    }
);


// =========================================
// DENSIDADE
// =========================================

densityInput.addEventListener(
    "input",
    function () {

        densityValue.textContent =
            this.value;

        converterImagem();

    }
);


// =========================================
// MODO
// =========================================

modeInput.addEventListener(
    "change",
    function () {

        converterImagem();

    }
);


// =========================================
// INVERTER
// =========================================

invertInput.addEventListener(
    "change",
    function () {

        converterImagem();

    }
);


// =========================================
// CARACTERE PERSONALIZADO
// =========================================

characterInput.addEventListener(
    "input",
    function () {

        converterImagem();

    }
);


// =========================================
// CONVERTER IMAGEM
// =========================================

function converterImagem() {

    if (!imagem) {
        return;
    }


    // -----------------------------------------
    // CONFIGURAÇÕES
    // -----------------------------------------

    const largura =
        parseInt(widthInput.value);


    const contraste =
        parseInt(contrastInput.value);


    const brilhoExtra =
        parseInt(brightnessInput.value);


    const densidade =
        parseInt(densityInput.value);


    const inverter =
        invertInput.checked;


    const modo =
        modeInput.value;


    let caractere =
        characterInput.value;


    if (!caractere) {

        caractere = "●";

    }


    // -----------------------------------------
    // PROPORÇÃO
    // -----------------------------------------

    const proporcao =
        imagem.height /
        imagem.width;


    /*
        Caracteres de texto são mais altos
        do que largos.

        0.5 corrige essa diferença.
    */

    const altura =
        Math.max(
            1,
            Math.floor(
                largura *
                proporcao *
                0.5
            )
        );


    // -----------------------------------------
    // CANVAS
    // -----------------------------------------

    canvas.width =
        largura;

    canvas.height =
        altura;


    ctx.clearRect(
        0,
        0,
        largura,
        altura
    );


    // -----------------------------------------
    // DESENHAR IMAGEM
    // -----------------------------------------

    ctx.drawImage(
        imagem,
        0,
        0,
        largura,
        altura
    );


    // -----------------------------------------
    // PEGAR PIXELS
    // -----------------------------------------

    const dados =
        ctx.getImageData(
            0,
            0,
            largura,
            altura
        ).data;


    // -----------------------------------------
    // PALETA
    // -----------------------------------------

    let paleta =
        PALETAS[modo];


    // -----------------------------------------
    // GERAR TEXTO
    // -----------------------------------------

    let resultado = "";


    for (
        let y = 0;
        y < altura;
        y++
    ) {

        for (
            let x = 0;
            x < largura;
            x++
        ) {

            const indice =
                (y * largura + x) * 4;


            const vermelho =
                dados[indice];


            const verde =
                dados[indice + 1];


            const azul =
                dados[indice + 2];


            const alpha =
                dados[indice + 3];


            // ---------------------------------
            // LUMINOSIDADE
            // ---------------------------------

            let luminosidade =
                0.299 * vermelho +
                0.587 * verde +
                0.114 * azul;


            // ---------------------------------
            // TRANSPARÊNCIA
            // ---------------------------------

            if (alpha < 128) {

                luminosidade = 255;

            }


            // ---------------------------------
            // BRILHO
            // ---------------------------------

            luminosidade +=
                brilhoExtra;


            luminosidade =
                Math.max(
                    0,
                    Math.min(
                        255,
                        luminosidade
                    )
                );


            // ---------------------------------
            // CONTRASTE
            // ---------------------------------

            luminosidade =
                aplicarContraste(
                    luminosidade,
                    contraste
                );


            // ---------------------------------
            // INVERTER
            // ---------------------------------

            if (inverter) {

                luminosidade =
                    255 - luminosidade;

            }


            // ---------------------------------
            // DENSIDADE
            // ---------------------------------

            /*
                density controla a intensidade
                geral dos caracteres.

                Valores menores deixam a imagem
                mais "leve".

                Valores maiores deixam a imagem
                mais preenchida.
            */

            const densidadeNormalizada =
                densidade / 100;


            luminosidade =
                128 +
                (
                    luminosidade -
                    128
                ) / densidadeNormalizada;


            luminosidade =
                Math.max(
                    0,
                    Math.min(
                        255,
                        luminosidade
                    )
                );


            // ---------------------------------
            // MAPEAR PARA CARACTERE
            // ---------------------------------

            const indiceCaractere =
                Math.floor(
                    (
                        luminosidade / 255
                    ) *
                    (
                        paleta.length - 1
                    )
                );


            let caractereFinal =
                paleta[indiceCaractere];


            // ---------------------------------
            // CARACTERE PERSONALIZADO
            // ---------------------------------

            if (modo === "dots") {

                /*
                    Mantemos o caractere personalizado
                    para os pontos mais fortes.
                */

                if (
                    indiceCaractere >=
                    Math.floor(
                        paleta.length * 0.65
                    )
                ) {

                    caractereFinal =
                        caractere;

                }

            }


            resultado +=
                caractereFinal;

        }


        resultado += "\n";

    }


    // -----------------------------------------
    // MOSTRAR RESULTADO
    // -----------------------------------------

    output.textContent =
        resultado;


    // -----------------------------------------
    // OCULTAR EMPTY STATE
    // -----------------------------------------

    emptyMessage.style.display =
        "none";


    // -----------------------------------------
    // INFORMAÇÕES
    // -----------------------------------------

    const totalCaracteres =
        resultado.length;


    resultInfo.textContent =
        `${totalCaracteres.toLocaleString("pt-BR")} caracteres`;

}


// =========================================
// CONTRASTE
// =========================================

function aplicarContraste(
    brilho,
    contraste
) {

    const fator =
        contraste / 100;


    brilho =
        128 +
        fator *
        (
            brilho -
            128
        );


    return Math.max(
        0,
        Math.min(
            255,
            brilho
        )
    );

}


// =========================================
// COPIAR
// =========================================

copyButton.addEventListener(
    "click",
    async function () {

        const texto =
            output.textContent;


        if (!texto) {

            return;

        }


        try {

            await navigator.clipboard
                .writeText(texto);


            const original =
                copyButton.textContent;


            copyButton.textContent =
                "COPIADO!";


            setTimeout(
                function () {

                    copyButton.textContent =
                        original;

                },
                1500
            );


        } catch (erro) {

            console.error(
                "Erro ao copiar:",
                erro
            );


            copiarFallback(texto);

        }

    }
);


// =========================================
// FALLBACK DE CÓPIA
// =========================================

function copiarFallback(texto) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        texto;


    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        copyButton.textContent =
            "COPIADO!";


        setTimeout(
            function () {

                copyButton.textContent =
                    "COPIAR TEXTO";

            },
            1500
        );


    } catch (erro) {

        console.error(
            "Erro ao copiar:",
            erro
        );

    }


    document.body.removeChild(
        textarea
    );

}


// =========================================
// LIMPAR
// =========================================

clearButton.addEventListener(
    "click",
    function () {

        imagem = null;

        imageInput.value = "";

        fileName.textContent =
            "NENHUMA IMAGEM SELECIONADA";


        output.textContent =
            "";


        emptyMessage.style.display =
            "flex";


        resultInfo.textContent =
            "0 caracteres";


        canvas.width = 1;

        canvas.height = 1;


        ctx.clearRect(
            0,
            0,
            1,
            1
        );

    }
);