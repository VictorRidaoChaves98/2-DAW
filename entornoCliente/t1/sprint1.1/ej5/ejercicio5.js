(function () {

    function getXPath(element) {
        if (!element) return '';
        if (element.nodeType === Node.TEXT_NODE) element = element.parentNode;
        if (!element) return '';

        if (element.id) return `//*[@id="${element.id}"]`;

        const parts = [];
        while (element && element.nodeType === 1) {
            let index = 1;
            let sibling = element.previousSibling;
            while (sibling) {
                if (sibling.nodeType === 1 && sibling.tagName === element.tagName) index++;
                sibling = sibling.previousSibling;
            }

            parts.unshift(element.nodeName.toLowerCase() + '[' + index + ']');
            element = element.parentNode;
            if (element && element.nodeType === Node.DOCUMENT_NODE) break;
        }

        return '/' + parts.join('/');
    }

    function showXpath(xpath) {
        alert("XPath: " + xpath);
        const p = document.getElementById('xpathConsole');
        if (p) p.textContent = "El xpath es -> " + xpath;  // Corregido
    }

    document.addEventListener('click', function (event) {
        if (event.target.ownerDocument !== document) return;  // Corregido tarjet → target
        const xpath = getXPath(event.target);
        showXpath(xpath);
    }, true);

    window.addEventListener('DOMContentLoaded', function () {
        const iframe = document.getElementById('myIframe');
        if (!iframe) return;

        try {
            const src = iframe.getAttribute('src') || '';
            if (src.startsWith('data:')) {
                const comma = src.indexOf(',');
                if (comma !== -1) {
                    const data = src.substring(comma + 1);
                    let html;
                    try {
                        html = decodeURIComponent(data);
                    } catch (e) {

                        if (src.includes(';base64')) {
                            const b64 = src.split(';base64,')[1];
                            html = atob(b64);
                        } else {
                            html = data;
                        }

                    }

                    iframe.srcdoc = html;
                    iframe.removeAttribute('src');
                }
            }
        } catch (err) {
            console.error("Error accessing iframe src:", err);
        }

        iframe.addEventListener('load', function () {
            try {
                const idoc = iframe.contentDocument || iframe.contentWindow.document;
                if (!idoc) throw new Error("Cannot access iframe document");

                idoc.addEventListener('click', function (evt) {
                    const xpathInside = getXPath(evt.target);
                    const iframeXPath = getXPath(iframe);
                    const final = iframeXPath + xpathInside;
                    showXpath(final);
                }, true);

                const btn = idoc.getElementById('iframeButton');
                if (btn) {
                    btn.addEventListener('click', function (e) {
                        const xpathInside = getXPath(e.target);
                        const iframeXPath = getXPath(iframe);
                        showXpath(iframeXPath + xpathInside);
                    }, true);
                }
            } catch (err) {
                console.warn("Cannot access iframe content due to cross-origin policy:", err);
                iframe.addEventListener('click', function () {
                    alert('Cannot retrieve XPath from iframe due to cross-origin restrictions.');
                    const p = document.getElementById('xpathConsole');
                    if (p) p.textContent = "Cannot retrieve XPath from iframe due to cross-origin restrictions.";
                });
            }
        });
    });

})();
