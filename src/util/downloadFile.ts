export function downloadURI(uri: string, name: string) {
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', name);
    link.setAttribute('target', "_blank");
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}