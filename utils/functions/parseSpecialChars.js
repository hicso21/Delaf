export default function parseSpecialChars(string) {
    const replacements = {
        á: "&aacute;",
        é: "&eacute;",
        í: "&iacute;",
        ó: "&oacute;",
        ú: "&uacute;",
        ñ: "&ntilde;",
        Á: "&Aacute;",
        É: "&Eacute;",
        Í: "&Iacute;",
        Ó: "&Oacute;",
        Ú: "&Uacute;",
        Ñ: "&Ntilde;",
        ü: "&uuml;",
        Ü: "&Uuml;",
        à: "&agrave;",
        À: "&Agrave;",
        è: "&egrave;",
        È: "&Egrave;",
        ò: "&ograve;",
        Ò: "&Ograve;",
    };
    return string.replace(
        /[áéíóúñÁÉÍÓÚÑüÜàÀèÈòÒ]/g,
        (match) => replacements[match]
    );
}
