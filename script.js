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

const ctx = canvas.getContext("2d");

// =========================================
// VARIÁVEIS
// =========================================

let imagem = null

// =========================================
// SELECIONAR IMAGEM
// =========================================

imageInput.addEventListener("change", function() {
    
    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        imagem = new Image();
        
        imagem.onload = function () {

            converterImagem();
        };

        imagem.src = event.target.result;

    };

    reader.readAsDataURL(arquivo);

});

// =========================================
// ATUALIZAR LARGURA
// =========================================

widthInput.addEventListener("input", function() {

    widthValue.textContent = this.value;

    converterImagem();

});

// =========================================
// ATUALIZAR CONTRASTE
// =========================================

contrastInput.addEventListener("input", function() {

    contrastValue.textContent = this.value;

    converterImagem();

});

// =========================================
// INVERTER
// =========================================

invertInput.addEventListener("input", function() {
    
    converterImagem();

});

// =========================================
// ALTERAR CARACTERE
// =========================================

characterInput.addEventListener("input", function()  {
    
    converterImagem();

});

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

    const largura = parseInt(widthInput.value);

    const contraste = parseInt(contrastInput.value);

    const inverter = invertInput.checked;

    const caractere = characterInput.value;

    // Se o usuário apagar o caractere
    if (caractere.lenght === 0) {

        caractere = "●";
    
    }

    // -----------------------------------------
    // CALCULAR PROPORÇÃO
    // -----------------------------------------

    const proporcao = imagem.height / imagem.width;

    /*
        Caracteres de texto são normalmente
        mais altos do que largos.

        Esse fator corrige um pouco a
        proporção da imagem.
    */

    const altura = Math.floor(
        largura * proporcao * 0.05
    );

    // -----------------------------------------
    // CONFIGURAR CANVAS
    // -----------------------------------------

    canvas.width = largura;
    canvas.height = altura;

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

    const dados = ctx.getImageData(
        0,
        0,
        largura,
        altura
    ).data;

    // -----------------------------------------
    // GERAR TEXTO
    // -----------------------------------------

    let resultado = "";

    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            
            const indice =
                (y * largura + x) * 4;
            
            const vermelho = dados[indice];

            const verde = dados[indice + 1];

            const azul = dados[indice + 2];

            const alpha= dados[indice + 3];

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

                brilho = 255
            }

            // ---------------------------------
            // CONTRASTE
            // ---------------------------------

            brilho = aplicarContraste(
                brilho,
                contraste
            );

            // ---------------------------------
            // INVERTER
            // ---------------------------------

            if (inverter) {
                brilho = 255 - brilho;
            }

            // ---------------------------------
            // CONVERTER PARA CARACTERE
            // ---------------------------------

            /*
                Quanto mais escuro o pixel,
                mais forte será o ponto.

                Como estamos usando apenas
                um caractere nesta primeira versão,
                usamos o brilho para decidir
                se o ponto aparece ou não.
            */

            const limite = 128;
            
            if (brilho < limite) {

                resultado += caractere;

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

    output.textContent = resultado;

}

// =========================================
// APLICAR CONTRASTE
// =========================================

function aplicarContraste(brilho, contraste) {

    /*
        contraste = 100
        mantém o valor original.

        contraste > 100
        aumenta o contraste.

        contraste < 100
        diminui o contraste.
    */

    const fator =
        contraste / 100;

    brilho =
        128 +
        fator * (brilho - 128);
    
    // Impedir valores menores que 0

    if (brilho < 0) {
        
        brilho = 0;
    }

    // Impedir valores maiores que 255

    if (brilho > 255) {

        brilho = 255;
    }

    return brilho;
    
}


// =========================================
// COPIAR TEXTO
// =========================================

copyButton.addEventListener("click", async function() {

    const texto = output.textContent;

    if (!texto) {

        return;
    }

    try {
        
        await navigator.clipboard.writeText(texto);

        const textoOriginal =
            copyButton.textContent;

        copyButton.textContent =
            "COPIADO!";

        selfTimeout(function() {

            copyButton.textContent =
                textoOriginal;

        }, 1500);

    } catch (erro) {

        console.error(
            "Erro ao copiar:",
            erro
        );
    }
});