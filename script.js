// =========================================
// ELEMENTOS DO HTML
// =========================================

const imageInput = document.getElementById("imageInput");

const characterInput = document.getElementById("character");

const widthInput = document.getElementById("width");
const widthValue = document.getElementById("widthValue");

const contrastInput = document.getElementById("contrast");
const contrastValue = document.getElementById("contrastValue");

const invertInput = document.getElementById("invert");

const output = document.getElementById("output");

const copyButton = document.getElementById("copyButton");

const canvas = document.getElementById("canvas");


// =========================================
// VERIFICAR ELEMENTOS
// =========================================

if (
    !imageInput ||
    !characterInput ||
    !widthInput ||
    !widthValue ||
    !contrastInput ||
    !contrastValue ||
    !invertInput ||
    !output ||
    !copyButton ||
    !canvas
) {
    console.error(
        "Erro: um ou mais elementos do HTML não foram encontrados."
    );
}


// =========================================
// CONTEXTO DO CANVAS
// =========================================

const ctx = canvas.getContext("2d");


// =========================================
// VARIÁVEIS
// =========================================

let imagem = null;


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


        // Verificar se é imagem

        if (!arquivo.type.startsWith("image/")) {

            alert(
                "Por favor, selecione uma imagem."
            );

            return;
        }


        console.log(
            "Imagem selecionada:",
            arquivo.name
        );


        // Criar leitor

        const reader =
            new FileReader();


        reader.onload = function (event) {

            imagem = new Image();


            imagem.onload = function () {

                console.log(
                    "Imagem carregada:",
                    imagem.width,
                    "x",
                    imagem.height
                );


                converterImagem();

            };


            imagem.onerror = function () {

                console.error(
                    "Erro ao carregar a imagem."
                );

                alert(
                    "Não foi possível carregar essa imagem."
                );

            };


            imagem.src =
                event.target.result;

        };


        reader.onerror = function () {

            console.error(
                "Erro ao ler o arquivo."
            );

            alert(
                "Não foi possível ler essa imagem."
            );

        };


        reader.readAsDataURL(arquivo);

    }
);


// =========================================
// ATUALIZAR LARGURA
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
// ATUALIZAR CONTRASTE
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
// INVERTER
// =========================================

invertInput.addEventListener(
    "change",
    function () {

        converterImagem();

    }
);


// =========================================
// ALTERAR CARACTERE
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


    const inverter =
        invertInput.checked;


    let caractere =
        characterInput.value;


    // Se o usuário apagar o caractere

    if (caractere.length === 0) {

        caractere = "●";

    }


    // -----------------------------------------
    // CALCULAR PROPORÇÃO
    // -----------------------------------------

    const proporcao =
        imagem.height / imagem.width;


    /*
        Caracteres monoespaçados geralmente
        são mais altos que largos.

        O fator 0.5 corrige a proporção.
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
    // CONFIGURAR CANVAS
    // -----------------------------------------

    canvas.width =
        largura;

    canvas.height =
        altura;


    // -----------------------------------------
    // LIMPAR CANVAS
    // -----------------------------------------

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

            let brilho =
                0.299 * vermelho +
                0.587 * verde +
                0.114 * azul;


            // ---------------------------------
            // TRANSPARÊNCIA
            // ---------------------------------

            if (alpha < 128) {

                brilho = 255;

            }


            // ---------------------------------
            // CONTRASTE
            // ---------------------------------

            brilho =
                aplicarContraste(
                    brilho,
                    contraste
                );


            // ---------------------------------
            // INVERTER
            // ---------------------------------

            if (inverter) {

                brilho =
                    255 - brilho;

            }


            // ---------------------------------
            // CONVERTER PARA CARACTERE
            // ---------------------------------

            const limite = 128;


            if (brilho < limite) {

                resultado +=
                    caractere;

            } else {

                resultado += " ";

            }

        }


        // Quebra de linha

        resultado += "\n";

    }


    // -----------------------------------------
    // MOSTRAR RESULTADO
    // -----------------------------------------

    output.textContent =
        resultado;

}


// =========================================
// APLICAR CONTRASTE
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
        (brilho - 128);


    // Limite inferior

    if (brilho < 0) {

        brilho = 0;

    }


    // Limite superior

    if (brilho > 255) {

        brilho = 255;

    }


    return brilho;

}


// =========================================
// COPIAR TEXTO
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


            const textoOriginal =
                copyButton.textContent;


            copyButton.textContent =
                "COPIADO!";


            setTimeout(
                function () {

                    copyButton.textContent =
                        textoOriginal;

                },
                1500
            );


        } catch (erro) {

            console.error(
                "Erro ao copiar:",
                erro
            );


            // Fallback para navegadores
            // que bloqueiam clipboard

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

            } catch (fallbackError) {

                console.error(
                    "Fallback de cópia também falhou:",
                    fallbackError
                );

            }


            document.body.removeChild(
                textarea
            );

        }

    }
);