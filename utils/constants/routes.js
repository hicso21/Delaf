const routesPath = {
    "/multimedia/video": "VIDEOS",
    "/multimedia/text": "TEXTOS",
    "/multimedia/tip": "TIPS",
    "/multimedia/audio": "AUDIOS",
    "/chat/juan": "CHAT CON JUAN",
    "/chat/global": "CHAT GLOBAL",
    "/activities/": "TU RUTINA DEL DÍA",
    "/calendar": "CALENDARIO",
    "/races": "CARRERAS",
    "/home": "HOME",
    "/profile": "PERFIL",
    "/nutrition": "NUTRITION",
    "/multimedia": "MULTIMEDIA",
    "/stats": "ESTADÍSTICAS",
    "/chat": "ESCOGE EL CHAT",
    "/activities": "ACTIVIDADES",
    "/frecuency": "FRECUENCIA CARDIACA",
    "/sync": "SINCRONIZA TU DISPOSITIVO",
    "/nutrition": "NUTRICIÓN",
};

const routeName = (path) => {
    const routes = Object.keys(routesPath);
    let pathToSee = "";

    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (path.includes(route)) pathToSee = routesPath[route];
    }

    if (pathToSee == "") pathToSee = "TU RUTINA DEL DÍA";
    return pathToSee;
};

export default routeName;
