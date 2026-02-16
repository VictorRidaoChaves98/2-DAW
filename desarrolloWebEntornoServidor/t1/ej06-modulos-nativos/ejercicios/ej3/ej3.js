// Descomponer una URL extrayendo: protocol, ipAdress, subDomain, domainName, folderTree, targetFile, argumentsFile.

function decomposeUrl(url) {
    let result = {
        protocol: null,
        ipAdress: null,
        subDomain: null,
        domainName: null,
        folderTree: null,
        targetFile: null,
        argumentsFile: null
    };

    // Separar protocolo
    let parts = url.split('://');
    if (parts.length > 1) {
        result.protocol = parts[0];
        url = parts[1];
    } else {
        result.protocol = 'http';
    }

    // Separar argumentos

    let argIndex = url.indexOf('?');
    if (argIndex != -1) {
        result.argumentsFile = url.slice(argIndex);
        url = url.slice(0, argIndex);
    }

    // Separar host y path

    let slashIndex = url.indexOf('/');
    let host = '';
    let path = '';
    if (slashIndex != -1) {
        host = url.slice(0, slashIndex);
        path = url.slice(slashIndex + 1);
    } else {
        host = url;
        path = '';
    }

    // Intentar ver si es uuna IP

    let hostParts = host.split('.');
    if (hostParts.length == 4 && hostParts[0] !== '') {
        result.ipAdress = host;
    } else {
        if (hostParts.length > 2) {
            result.subDomain = hostParts.slice(0, hostParts.length - 2).join('.');
            result.domainName = hostParts.slice(hostParts.length - 2).join('.');
        } else {
            result.domainName = host;
        }
    }

    // Path
    if (path !== '') {
        let pathParts = path.split('/');
        if (pathParts.length == 1) {
            result.targetFile = pathParts[0];
            result.folderTree = null;
        } else {
            result.targetFile = pathParts[pathParts.length - 1];
            let folders = [];
            for (let i = 0; i < pathParts.length - 1; i++) {
                folders.push(pathParts[i]);
            }
            result.folderTree = folders;
        }
    }

    return result;
}
