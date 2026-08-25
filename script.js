// =========================================
// GALACTUS TEXT ART
// V4.0
// =========================================


// =========================================
// ELEMENTOS
// =========================================

const imageInput =
    document.getElementById("imageInput");

const uploadBox =
    document.getElementById("uploadBox");

const fileInfo =
    document.getElementById("fileInfo");

const imagePreview =
    document.getElementById("imagePreview");

const originalEmpty =
    document.getElementById("originalEmpty");

const dimensions =
    document.getElementById("dimensions");

const miniOutput =
    document.getElementById("miniOutput");

const miniEmpty =
    document.getElementById("miniEmpty");

const previewType =
    document.getElementById("previewType");

const character =
    document.getElementById("character");

const characterSet =
    document.getElementById("characterSet");

const width =
    document.getElementById("width");

const widthValue =
    document.getElementById("widthValue");

const contrast =
    document.getElementById("contrast");

const contrastValue =
    document.getElementById("contrastValue");

const brightness =
    document.getElementById("brightness");

const brightnessValue =
    document.getElementById("brightnessValue");

const density =
    document.getElementById("density");

const densityValue =
    document.getElementById("densityValue");

const spacingX =
    document.getElementById("spacingX");

const spacingXValue =
    document.getElementById("spacingXValue");

const spacingY =
    document.getElementById("spacingY");

const spacingYValue =
    document.getElementById("spacingYValue");

const aspectRatio =
    document.getElementById("aspectRatio");

const invert =
    document.getElementById("invert");

const output =
    document.getElementById("output");

const outputEmpty =
    document.getElementById("outputEmpty");

const resultStats =
    document.getElementById("resultStats");

const copyButton =
    document.getElementById("copyButton");

const downloadButton =
    document.getElementById("downloadButton");

const clearButton =
    document.getElementById("clearButton");

const status =
    document.getElementById("status");

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const presets =
    document.querySelectorAll(".preset");


// =========================================
// ESTADO
// =========================================

let image = null;

let currentText = "";


// =========================================
// CONJUNTOS DE CARACTERES
// =========================================

const CHARACTER_SETS = {

    single: null,

    dots:
        " ·•●",

    ascii:
        " .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",

    blocks:
        " ░▒▓█",

    shade:
        " .░▒▓█",

    minimal:
        " .·•●"

};


// =========================================
// PRESETS
// =========================================

const PRESETS = {

    default: {

        character: "●",

        characterSet: "single",

        width: 80,

        contrast: 100,

        brightness: 0,

        density: 100,

        spacingX: 1,

        spacingY: 1,

        aspectRatio: 0.5,

        invert: false

    },


    dot: {

        character: "●",

        characterSet: "dots",

        width: 80,

        contrast: 120,

        brightness: 0,

        density: 110,

        spacingX: 1,

        spacingY: 1,

        aspectRatio: 0.5,

        invert: false

    },


    ascii: {

        character: "#",

        characterSet: "ascii",

        width: 100,

        contrast: 130,

        brightness: 0,

        density: 100,

        spacingX: 1,

        spacingY: 1,

        aspectRatio: 0.5,

        invert: false

    },


    block: {

        character: "█",

        characterSet: "blocks",

        width: 90,

        contrast: 140,

        brightness: 0,

        density: 120,

        spacingX: 1,

        spacingY: 1,

        aspectRatio: 0.6,

        invert: false

    },


    dense: {

        character: "●",

        characterSet: "dots",

        width: 120,

        contrast: 160,

        brightness: -10,

        density: 160,

        spacingX: 1,

        spacingY: 1,

        aspectRatio: 0.5,

        invert: false

    },


    soft: {

        character: "·",

        characterSet: "dots",

        width: 80,

        contrast: 70,

        brightness: 15,

        density: 70,

        spacingX: 1,

        spacingY: 1,

        aspectRatio: 0.5,

        invert: false

    }

};


// =========================================
// UPLOAD
// =========================================

imageInput.addEventListener(
    "change",
    function () {

        const file =
            imageInput.files[0];


        if (!file) {

            return;

        }


        carregarImagem(file);

    }
);


// =========================================
// CARREGAR IMAGEM
// =========================================

function carregarImagem(file) {

    if (
        !file.type.startsWith("image/")
    ) {

        mostrarStatus(
            "ARQUIVO INVÁLIDO",
            true
        );

        return;

    }


    fileInfo.textContent =
        `${file.name} • ${formatBytes(file.size)}`;


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            const newImage =
                new Image();


            newImage.onload =
                function () {

                    image =
                        newImage;


                    imagePreview.src =
                        event.target.result;


                    imagePreview.style.display =
                        "block";


                    originalEmpty.style.display =
                        "none";


                    dimensions.textContent =
                        `${image.width} × ${image.height}`;


                    mostrarStatus(
                        "IMAGEM CARREGADA",
                        false
                    );


                    converter();

                };


            newImage.onerror =
                function () {

                    mostrarStatus(
                        "ERRO AO CARREGAR IMAGEM",
                        true
                    );

                };


            newImage.src =
                event.target.result;

        };


    reader.onerror =
        function () {

            mostrarStatus(
                "ERRO AO LER ARQUIVO",
                true
            );

        };


    reader.readAsDataURL(file);

}


// =========================================
// DRAG & DROP
// =========================================

uploadBox.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadBox.classList.add(
            "dragging"
        );

    }
);


uploadBox.addEventListener(
    "dragleave",
    function () {

        uploadBox.classList.remove(
            "dragging"
        );

    }
);


uploadBox.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();


        uploadBox.classList.remove(
            "dragging"
        );


        const file =
            event.dataTransfer.files[0];


        if (!file) {

            return;

        }


        carregarImagem(file);

    }
);


// =========================================
// CONTROLES
// =========================================

const controls =
    [

        width,
        contrast,
        brightness,
        density,
        spacingX,
        spacingY,
        character,
        characterSet,
        aspectRatio,
        invert

    ];


controls.forEach(
    function (control) {

        control.addEventListener(
            "input",
            converter
        );


        control.addEventListener(
            "change",
            converter
        );

    }
);


// =========================================
// CONVERTER
// =========================================

function converter() {

    atualizarValores();


    if (!image) {

        return;

    }


    const config =
        obterConfiguracao();


    const result =
        gerarTextArt(config);


    currentText =
        result;


    output.textContent =
        result;


    miniOutput.textContent =
        result;


    outputEmpty.style.display =
        "none";


    miniEmpty.style.display =
        "none";


    atualizarEstatisticas(
        result
    );


    previewType.textContent =
        config.characterSet.toUpperCase();


    mostrarStatus(
        "CONVERSÃO ATUALIZADA",
        false
    );

}


// =========================================
// CONFIGURAÇÃO
// =========================================

function obterConfiguracao() {

    return {

        width:
            parseInt(width.value),

        contrast:
            parseInt(contrast.value),

        brightness:
            parseInt(brightness.value),

        density:
            parseInt(density.value),

        spacingX:
            parseInt(spacingX.value),

        spacingY:
            parseInt(spacingY.value),

        aspectRatio:
            parseFloat(
                aspectRatio.value
            ),

        character:
            character.value || "●",

        characterSet:
            characterSet.value,

        invert:
            invert.checked

    };

}


// =========================================
// GERAR TEXT ART
// =========================================

function gerarTextArt(config) {

    const targetWidth =
        config.width;


    const imageRatio =
        image.height /
        image.width;


    const targetHeight =
        Math.max(
            1,
            Math.floor(
                targetWidth *
                imageRatio *
                config.aspectRatio
            )
        );


    canvas.width =
        targetWidth;


    canvas.height =
        targetHeight;


    ctx.clearRect(
        0,
        0,
        targetWidth,
        targetHeight
    );


    ctx.drawImage(
        image,
        0,
        0,
        targetWidth,
        targetHeight
    );


    const pixels =
        ctx.getImageData(
            0,
            0,
            targetWidth,
            targetHeight
        ).data;


    let result = "";


    for (
        let y = 0;
        y < targetHeight;
        y += config.spacingY
    ) {

        for (
            let x = 0;
            x < targetWidth;
            x += config.spacingX
        ) {

            const index =
                (
                    y *
                    targetWidth +
                    x
                ) * 4;


            const red =
                pixels[index];


            const green =
                pixels[index + 1];


            const blue =
                pixels[index + 2];


            const alpha =
                pixels[index + 3];


            // ---------------------------------
            // BRILHO ORIGINAL
            // ---------------------------------

            let value =
                (
                    0.299 * red +
                    0.587 * green +
                    0.114 * blue
                );


            // ---------------------------------
            // TRANSPARÊNCIA
            // ---------------------------------

            if (alpha < 128) {

                value = 255;

            }


            // ---------------------------------
            // BRILHO
            // ---------------------------------

            value +=
                config.brightness;


            value =
                limitar(
                    value,
                    0,
                    255
                );


            // ---------------------------------
            // CONTRASTE
            // ---------------------------------

            value =
                aplicarContraste(
                    value,
                    config.contrast
                );


            // ---------------------------------
            // INVERSÃO
            // ---------------------------------

            if (config.invert) {

                value =
                    255 - value;

            }


            // ---------------------------------
            // DENSIDADE
            // ---------------------------------

            value =
                aplicarDensidade(
                    value,
                    config.density
                );


            // ---------------------------------
            // CARACTERE
            // ---------------------------------

            result +=
                obterCaractere(
                    value,
                    config
                );

        }


        result += "\n";

    }


    return result;

}


// =========================================
// OBTER CARACTERE
// =========================================

function obterCaractere(
    value,
    config
) {

    const set =
        CHARACTER_SETS[
            config.characterSet
        ];


    // -----------------------------------------
    // PERSONALIZADO
    // -----------------------------------------

    if (!set) {

        /*
            Para o modo personalizado,
            o caractere aparece de acordo
            com a intensidade.
        */

        if (value < 128) {

            return config.character;

        }


        return " ";

    }


    // -----------------------------------------
    // PALETA
    // -----------------------------------------

    const index =
        Math.floor(
            (
                value / 255
            ) *
            (
                set.length - 1
            )
        );


    return set[index];

}


// =========================================
// DENSIDADE
// =========================================

function aplicarDensidade(
    value,
    density
) {

    const factor =
        density / 100;


    if (factor === 1) {

        return value;

    }


    const result =
        128 +
        (
            value - 128
        ) /
        factor;


    return limitar(
        result,
        0,
        255
    );

}


// =========================================
// CONTRASTE
// =========================================

function aplicarContraste(
    value,
    contrast
) {

    const factor =
        contrast / 100;


    const result =
        128 +
        (
            value - 128
        ) *
        factor;


    return limitar(
        result,
        0,
        255
    );

}


// =========================================
// LIMITAR
// =========================================

function limitar(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


// =========================================
// ATUALIZAR VALORES
// =========================================

function atualizarValores() {

    widthValue.textContent =
        width.value;


    contrastValue.textContent =
        contrast.value;


    brightnessValue.textContent =
        brightness.value;


    densityValue.textContent =
        density.value;


    spacingXValue.textContent =
        spacingX.value;


    spacingYValue.textContent =
        spacingY.value;

}


// =========================================
// PRESETS
// =========================================

presets.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const name =
                    button.dataset.preset;


                const preset =
                    PRESETS[name];


                if (!preset) {

                    return;

                }


                aplicarPreset(
                    preset
                );


                presets.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                converter();

            }
        );

    }
);


// =========================================
// APLICAR PRESET
// =========================================

function aplicarPreset(
    preset
) {

    character.value =
        preset.character;


    characterSet.value =
        preset.characterSet;


    width.value =
        preset.width;


    contrast.value =
        preset.contrast;


    brightness.value =
        preset.brightness;


    density.value =
        preset.density;


    spacingX.value =
        preset.spacingX;


    spacingY.value =
        preset.spacingY;


    aspectRatio.value =
        preset.aspectRatio;


    invert.checked =
        preset.invert;

}


// =========================================
// COPIAR
// =========================================

copyButton.addEventListener(
    "click",
    async function () {

        if (!currentText) {

            mostrarStatus(
                "NÃO HÁ TEXTO PARA COPIAR",
                true
            );

            return;

        }


        try {

            await navigator.clipboard.writeText(
                currentText
            );


            const oldText =
                copyButton.textContent;


            copyButton.textContent =
                "COPIADO!";


            mostrarStatus(
                "TEXTO COPIADO",
                false
            );


            setTimeout(
                function () {

                    copyButton.textContent =
                        oldText;

                },
                1200
            );

        }

        catch (error) {

            copiarFallback();

        }

    }
);


// =========================================
// FALLBACK COPY
// =========================================

function copiarFallback() {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        currentText;


    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        mostrarStatus(
            "TEXTO COPIADO",
            false
        );

    }

    catch (error) {

        mostrarStatus(
            "NÃO FOI POSSÍVEL COPIAR",
            true
        );

    }


    document.body.removeChild(
        textarea
    );

}


// =========================================
// DOWNLOAD TXT
// =========================================

downloadButton.addEventListener(
    "click",
    function () {

        if (!currentText) {

            mostrarStatus(
                "NÃO HÁ TEXTO PARA BAIXAR",
                true
            );

            return;

        }


        const blob =
            new Blob(
                [
                    currentText
                ],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "galactus-text-art.txt";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );


        mostrarStatus(
            "ARQUIVO TXT GERADO",
            false
        );

    }
);


// =========================================
// LIMPAR
// =========================================

clearButton.addEventListener(
    "click",
    function () {

        image = null;

        currentText = "";


        imageInput.value =
            "";


        imagePreview.src =
            "";


        imagePreview.style.display =
            "none";


        originalEmpty.style.display =
            "flex";


        miniOutput.textContent =
            "";


        miniEmpty.style.display =
            "flex";


        output.textContent =
            "";


        outputEmpty.style.display =
            "flex";


        fileInfo.textContent =
            "NENHUMA IMAGEM";


        dimensions.textContent =
            "0 × 0";


        resultStats.textContent =
            "0 caracteres";


        previewType.textContent =
            "DOTS";


        mostrarStatus(
            "PROJETO LIMPO",
            false
        );

    }
);


// =========================================
// STATUS
// =========================================

function mostrarStatus(
    message,
    error
) {

    status.textContent =
        message;


    status.classList.toggle(
        "success",
        !error
    );

}


// =========================================
// TAMANHO DO ARQUIVO
// =========================================

function formatBytes(
    bytes
) {

    if (bytes === 0) {

        return "0 B";

    }


    const units =
        [
            "B",
            "KB",
            "MB",
            "GB"
        ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        bytes /
        Math.pow(
            1024,
            index
        )
    ).toFixed(1)
    + " "
    + units[index];

}


// =========================================
// ESTATÍSTICAS
// =========================================

function atualizarEstatisticas(
    text
) {

    const characters =
        text.length;


    const lines =
        text.split("\n").length - 1;


    const visibleCharacters =
        text.replace(
            /\n/g,
            ""
        ).length;


    resultStats.textContent =
        `${visibleCharacters.toLocaleString("pt-BR")} caracteres • ${lines} linhas`;

}


// =========================================
// ATALHOS
// =========================================

document.addEventListener(
    "keydown",
    function (event) {

        // CTRL + V
        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "v"
        ) {

            /*
                O navegador trata o Ctrl+V
                normalmente. Não interferimos.
            */

        }


        // CTRL + C
        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "c"
        ) {

            /*
                Não interceptamos porque
                o usuário pode copiar texto
                normalmente.
            */

        }


        // ESC
        if (
            event.key === "Escape"
        ) {

            /*
                ESC limpa o foco de inputs.
            */

            document.activeElement.blur();

        }

    }
);


// =========================================
// INICIALIZAÇÃO
// =========================================

atualizarValores();

