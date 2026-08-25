// =========================================
// GALACTUS TEXT ART
// V5.0
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

const renderMode =
    document.getElementById("renderMode");

const invert =
    document.getElementById("invert");

const proportional =
    document.getElementById("proportional");

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

const presetButtons =
    document.querySelectorAll(".preset");

const quickWidthButtons =
    document.querySelectorAll(
        ".quick-width button"
    );


// =========================================
// ESTADO
// =========================================

let image = null;

let currentText = "";


// =========================================
// PALETAS
// =========================================

const palettes = {

    single: null,

    dots:
        " ●",

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

const presets = {

    default: {

        character: "●",

        set: "single",

        width: 80,

        contrast: 100,

        brightness: 0,

        density: 100,

        spacingX: 1,

        spacingY: 1,

        aspect: "0.50",

        mode: "normal",

        invert: false

    },


    dots: {

        character: "●",

        set: "dots",

        width: 90,

        contrast: 120,

        brightness: 0,

        density: 110,

        spacingX: 1,

        spacingY: 1,

        aspect: "0.50",

        mode: "normal",

        invert: false

    },


    ascii: {

        character: "#",

        set: "ascii",

        width: 100,

        contrast: 130,

        brightness: 0,

        density: 100,

        spacingX: 1,

        spacingY: 1,

        aspect: "0.50",

        mode: "normal",

        invert: false

    },


    block: {

        character: "█",

        set: "blocks",

        width: 80,

        contrast: 140,

        brightness: 0,

        density: 120,

        spacingX: 1,

        spacingY: 1,

        aspect: "0.60",

        mode: "dense",

        invert: false

    },


    shade: {

        character: "▓",

        set: "shade",

        width: 90,

        contrast: 120,

        brightness: 0,

        density: 100,

        spacingX: 1,

        spacingY: 1,

        aspect: "0.50",

        mode: "normal",

        invert: false

    },


    minimal: {

        character: "•",

        set: "minimal",

        width: 80,

        contrast: 90,

        brightness: 5,

        density: 80,

        spacingX: 1,

        spacingY: 1,

        aspect: "0.50",

        mode: "threshold",

        invert: false

    },


    dense: {

        character: "●",

        set: "dots",

        width: 120,

        contrast: 160,

        brightness: -10,

        density: 160,

        spacingX: 1,

        spacingY: 1,

        aspect: "0.50",

        mode: "dense",

        invert: false

    },


    soft: {

        character: "·",

        set: "minimal",

        width: 80,

        contrast: 65,

        brightness: 15,

        density: 70,

        spacingX: 1,

        spacingY: 1,

        aspect: "0.50",

        mode: "normal",

        invert: false

    }

};


// =========================================
// INPUT
// =========================================

imageInput.addEventListener(
    "change",
    () => {

        const file =
            imageInput.files[0];

        if (!file) {

            return;

        }

        loadImage(file);

    }
);


// =========================================
// LOAD IMAGE
// =========================================

function loadImage(file) {

    if (
        !file.type.startsWith("image/")
    ) {

        setStatus(
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
        event => {

            const img =
                new Image();


            img.onload =
                () => {

                    image = img;


                    imagePreview.src =
                        event.target.result;


                    imagePreview.style.display =
                        "block";


                    originalEmpty.style.display =
                        "none";


                    dimensions.textContent =
                        `${img.width} × ${img.height}`;


                    setStatus(
                        "IMAGEM CARREGADA",
                        false
                    );


                    convert();

                };


            img.onerror =
                () => {

                    setStatus(
                        "ERRO AO PROCESSAR IMAGEM",
                        true
                    );

                };


            img.src =
                event.target.result;

        };


    reader.onerror =
        () => {

            setStatus(
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
    event => {

        event.preventDefault();

        uploadBox.classList.add(
            "dragging"
        );

    }
);


uploadBox.addEventListener(
    "dragleave",
    () => {

        uploadBox.classList.remove(
            "dragging"
        );

    }
);


uploadBox.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        uploadBox.classList.remove(
            "dragging"
        );


        const file =
            event.dataTransfer.files[0];


        if (file) {

            loadImage(file);

        }

    }
);


// =========================================
// CONTROLS
// =========================================

const reactiveControls = [

    character,

    characterSet,

    width,

    contrast,

    brightness,

    density,

    spacingX,

    spacingY,

    aspectRatio,

    renderMode,

    invert,

    proportional

];


reactiveControls.forEach(
    control => {

        control.addEventListener(
            "input",
            convert
        );

        control.addEventListener(
            "change",
            convert
        );

    }
);


// =========================================
// QUICK WIDTH
// =========================================

quickWidthButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                width.value =
                    button.dataset.width;

                convert();

            }
        );

    }
);


// =========================================
// CONVERT
// =========================================

function convert() {

    updateValues();


    if (!image) {

        return;

    }


    const config =
        getConfig();


    const text =
        createTextArt(
            config
        );


    currentText =
        text;


    output.textContent =
        text;


    outputEmpty.style.display =
        "none";


    updateStats(
        text
    );


    setStatus(
        "CONVERSÃO ATUALIZADA",
        false
    );

}


// =========================================
// CONFIG
// =========================================

function getConfig() {

    return {

        width:
            Number(width.value),

        contrast:
            Number(contrast.value),

        brightness:
            Number(brightness.value),

        density:
            Number(density.value),

        spacingX:
            Number(spacingX.value),

        spacingY:
            Number(spacingY.value),

        aspect:
            Number(aspectRatio.value),

        character:
            character.value || "●",

        set:
            characterSet.value,

        mode:
            renderMode.value,

        invert:
            invert.checked,

        proportional:
            proportional.checked

    };

}


// =========================================
// CREATE TEXT ART
// =========================================

function createTextArt(config) {

    const targetWidth =
        config.width;


    const ratio =
        image.height /
        image.width;


    let targetHeight;


    if (config.proportional) {

        targetHeight =
            Math.floor(
                targetWidth *
                ratio *
                config.aspect
            );

    } else {

        targetHeight =
            Math.floor(
                targetWidth *
                ratio
            );

    }


    targetHeight =
        Math.max(
            1,
            targetHeight
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


    const data =
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


            const r =
                data[index];


            const g =
                data[index + 1];


            const b =
                data[index + 2];


            const a =
                data[index + 3];


            let brightness =
                (
                    0.299 * r +
                    0.587 * g +
                    0.114 * b
                );


            if (a < 128) {

                brightness = 255;

            }


            brightness +=
                config.brightness;


            brightness =
                clamp(
                    brightness,
                    0,
                    255
                );


            brightness =
                applyContrast(
                    brightness,
                    config.contrast
                );


            if (config.invert) {

                brightness =
                    255 - brightness;

            }


            brightness =
                applyDensity(
                    brightness,
                    config.density
                );


            result +=
                pixelToCharacter(
                    brightness,
                    config
                );

        }


        result += "\n";

    }


    return result;

}


// =========================================
// PIXEL → CHARACTER
// =========================================

function pixelToCharacter(
    brightness,
    config
) {

    const palette =
        palettes[
            config.set
        ];


    // =====================================
    // PERSONALIZADO
    // =====================================

    if (!palette) {

        if (
            config.mode ===
            "threshold"
        ) {

            return brightness < 140
                ? config.character
                : " ";

        }


        if (
            config.mode ===
            "dense"
        ) {

            if (brightness < 70) {

                return config.character;

            }

            if (brightness < 150) {

                return config.character;

            }

            return " ";

        }


        return brightness < 128
            ? config.character
            : " ";

    }


    // =====================================
    // PALETA
    // =====================================

    if (
        config.mode ===
        "threshold"
    ) {

        return brightness < 128
            ? palette[
                palette.length - 1
            ]
            : " ";

    }


    const index =
        Math.floor(
            (
                brightness /
                255
            ) *
            (
                palette.length - 1
            )
        );


    return palette[index];

}


// =========================================
// CONTRAST
// =========================================

function applyContrast(
    value,
    contrast
) {

    const factor =
        contrast / 100;


    return clamp(
        128 +
        (
            value - 128
        ) *
        factor,

        0,

        255
    );

}


// =========================================
// DENSITY
// =========================================

function applyDensity(
    value,
    density
) {

    if (
        density === 100
    ) {

        return value;

    }


    const factor =
        density / 100;


    return clamp(
        128 +
        (
            value - 128
        ) /
        factor,

        0,

        255
    );

}


// =========================================
// CLAMP
// =========================================

function clamp(
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
// UPDATE VALUES
// =========================================

function updateValues() {

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

presetButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const name =
                    button.dataset.preset;


                const preset =
                    presets[name];


                if (!preset) {

                    return;

                }


                applyPreset(
                    preset
                );


                presetButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                convert();

            }
        );

    }
);


// =========================================
// APPLY PRESET
// =========================================

function applyPreset(
    preset
) {

    character.value =
        preset.character;

    characterSet.value =
        preset.set;

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
        preset.aspect;

    renderMode.value =
        preset.mode;

    invert.checked =
        preset.invert;

}


// =========================================
// COPY
// =========================================

copyButton.addEventListener(
    "click",
    async () => {

        if (!currentText) {

            setStatus(
                "NÃO HÁ TEXTO PARA COPIAR",
                true
            );

            return;

        }


        try {

            await navigator.clipboard.writeText(
                currentText
            );


            const original =
                copyButton.textContent;


            copyButton.textContent =
                "COPIADO";


            setStatus(
                "TEXTO COPIADO PARA A ÁREA DE TRANSFERÊNCIA",
                false
            );


            setTimeout(
                () => {

                    copyButton.textContent =
                        original;

                },
                1200
            );

        }

        catch {

            fallbackCopy();

        }

    }
);


// =========================================
// FALLBACK COPY
// =========================================

function fallbackCopy() {

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


        setStatus(
            "TEXTO COPIADO",
            false
        );

    }

    catch {

        setStatus(
            "NÃO FOI POSSÍVEL COPIAR",
            true
        );

    }


    textarea.remove();

}


// =========================================
// DOWNLOAD
// =========================================

downloadButton.addEventListener(
    "click",
    () => {

        if (!currentText) {

            setStatus(
                "NÃO HÁ TEXTO PARA EXPORTAR",
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


        link.click();


        URL.revokeObjectURL(
            url
        );


        setStatus(
            "ARQUIVO TXT GERADO",
            false
        );

    }
);


// =========================================
// CLEAR
// =========================================

clearButton.addEventListener(
    "click",
    () => {

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


        setStatus(
            "PROJETO LIMPO",
            false
        );

    }
);


// =========================================
// STATS
// =========================================

function updateStats(text) {

    const lines =
        text.split("\n").length - 1;


    const characters =
        text.replace(
            /\n/g,
            ""
        ).length;


    resultStats.textContent =
        `${characters.toLocaleString("pt-BR")} caracteres • ${lines} linhas`;

}


// =========================================
// STATUS
// =========================================

function setStatus(
    message,
    error = false
) {

    status.textContent =
        message;


    status.classList.toggle(
        "ok",
        !error
    );


    status.classList.toggle(
        "error",
        error
    );

}


// =========================================
// FILE SIZE
// =========================================

function formatBytes(bytes) {

    if (
        bytes === 0
    ) {

        return "0 B";

    }


    const units = [
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
// INIT
// =========================================

updateValues();

setStatus(
    "SISTEMA PRONTO",
    false
);